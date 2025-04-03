import { file, Glob, Transpiler, write, type BunPlugin } from "bun";
import * as sass from "sass-embedded";
import { transform } from "lightningcss";
import watcher from "@parcel/watcher";
import { mode } from "./variables";
import { Directory } from "./enums";
import { link, mkdir, rm } from "node:fs/promises";
import { dirname } from "node:path";

export const cleanDirectories: BunPlugin = {
  name: "Clean Directories",
  setup(build) {
    build.onStart(async () => {
      const cleanDir = async (dir: string) => {
        rm(dir, { recursive: true, force: true })
          .catch(() => {
            console.log(`File at path, ${dir}, doesn't exist. Skipping.`);
          })
          .finally(async () => {
            await mkdir(dir, { recursive: true });
          });
      };

      await cleanDir(Directory.OUTPUT);
      await cleanDir(Directory.BUNDLED_STORY);
    });
  },
};

async function processCSS(cssString: string, filePath?: string) {
  const filename = filePath || "input.css";

  // Lightning CSS automatically applies vendor prefixes based on the specified targets.
  // It also minifies the output when `minify` is set to true.
  const { code } = transform({
    filename,
    code: Buffer.from(cssString),
    minify: mode == "production",

    // Define browser targets to control autoprefixing and feature transpilation.
    targets: {
      chrome: 80,
      firefox: 80,
      safari: 13,
      edge: 80,
    },
  });

  // Return the transformed CSS as a string.
  console.log(code.toString());
  return code.toString();
}

/**
 * Also works with regular css files
 */
export const scssToCss: BunPlugin = {
  name: "SCSS To CSS",
  setup(build) {
    build.onLoad({ filter: /\.(scss|css)$/ }, async ({ path }) => {
      const convertedCSS = path.endsWith(".scss")
        ? (await sass.compileAsync(path)).css
        : await file(path).text();

      const baseUrl = process.cwd() + Directory.ASSETS.replace(".", "");

      // Regex explanation:
      // url\((['"]?)    : Matches 'url(' followed by an optional quote (captured as group 1)
      // \/              : Matches a literal slash indicating the start of an absolute path
      // ([^'")]+)       : Captures one or more characters that are not a quote, closing parenthesis, or double quote (group 2)
      // \1              : Matches the same quote character as captured in group 1 (if any)
      // \)              : Matches the closing parenthesis ')'
      const updatedCSS = convertedCSS.replace(
        /url\((['"]?)\/([^'")]+)\1\)/g,
        (_, quote, path) => {
          return `url(${quote}${baseUrl}/${path}${quote})`;
        }
      );

      // console.log(updatedCss);

      return { contents: updatedCSS, loader: "css" };
    });
  },
};

const getFilePathsRecursivelyFromDirectory = async (
  fileGlobPattern: string,
  dirToSearch?: string
) => {
  const glob = new Glob(fileGlobPattern);
  const filePaths: string[] = [];

  // Scans the current working directory and each of its sub-directories recursively
  for await (const filePath of glob.scan(dirToSearch ?? ".")) {
    filePaths.push(filePath);
  }
  return filePaths;
};

/** For moving all the bundled assets into the final directory*/
export async function copyAssets() {
  const filePaths = await getFilePathsRecursivelyFromDirectory(
    "*",
    Directory.BUNDLED_ASSETS
  );

  // console.log(filePaths);
  filePaths.forEach(async (path) => {
    await write(
      Directory.BUNDLED_STORY_ASSETS + "/" + path,
      file(Directory.BUNDLED_ASSETS + "/" + path)
    );
  });
}

const trimFilePath = (path: string) => {
  return "./" + path.replace(process.cwd(), "");
};

export const bundleScriptAndStyleExtensions: BunPlugin = {
  name: "Bundle JS and CSS extensions",
  setup(build) {
    build.onStart(async () => {
      const jsFilePaths = await getFilePathsRecursivelyFromDirectory(
        "**/*.js",
        Directory.SCRIPT_EXTENSIONS
      );
      const cssFilePaths = await getFilePathsRecursivelyFromDirectory(
        "**/*.css",
        Directory.STYLE_EXTENSIONS
      );

      const processContentOfFiles = async (
        filePaths: string[],
        fileType: "css" | "js"
      ) => {
        const scriptTranspiler = new Transpiler({
          inline: true,
          deadCodeElimination: true,
          minifyWhitespace: true,
        });

        filePaths.forEach(async (path) => {
          const combinedPath = `${
            fileType == "css"
              ? Directory.STYLE_EXTENSIONS
              : Directory.SCRIPT_EXTENSIONS
          }/${path}`;
          let fileText = await file(combinedPath).text();

          // Processing
          if (mode == "production") {
            if (fileType == "css") {
              fileText = await processCSS(fileText);
            } else {
              fileText = scriptTranspiler.transformSync(fileText);
            }
          }

          const sanitizedPath = path.replace("/", "_");
          write(
            fileType == "css"
              ? `${Directory.BUNDLED_STYLES_DIR}/0_${sanitizedPath}`
              : `${Directory.BUNDLED_SCRIPTS_DIR}/0_${sanitizedPath}`,
            fileText
          );
        });
      };

      await processContentOfFiles(cssFilePaths, "css");
      await processContentOfFiles(jsFilePaths, "js");

      if (mode == "development") {
        const scriptSubscription = watcher.subscribe(
          Directory.SCRIPT_EXTENSIONS,
          async (_, events) => {
            events.forEach(async (e) => {
              await processContentOfFiles([trimFilePath(e.path)], "js");
            });
          }
        );
        const styleSubscription = watcher.subscribe(
          Directory.SCRIPT_EXTENSIONS,
          async (_, events) => {
            events.forEach(async (e) => {
              await processContentOfFiles([trimFilePath(e.path)], "css");
            });
          }
        );
        process.on("SIGINT", async () => {
          await (await scriptSubscription).unsubscribe();
          await (await styleSubscription).unsubscribe();
          process.exit(0);
        });
      }
    });
  },
};

/**
 * UNUSED
 */
export const copyOtherAssets: BunPlugin = {
  name: "Copy Non-Code Assets (e.g audio, fonts, images, etc)",
  setup(build) {
    build.onStart(async () => {
      const appStr = `${Directory.APP}/`.replace(`${Directory.ASSETS}/`, ""); // Yeah, don't think too much about this but with the default values, you're meant to get "app/"

      // Skip scripts and styles
      const assetPaths = await getFilePathsRecursivelyFromDirectory(
        `!${appStr}**`, // Ignore all the files in the "app" directory (basically the styles and scripts)
        Directory.ASSETS
      );

      const fastCopyFile = async (
        originPath: string,
        destinationPath: string
      ) => {
        const destFile = file(destinationPath);
        const copyFunc = async () => {
          // Ensure the destination directory exists
          await mkdir(dirname(destinationPath), { recursive: true });

          await link(originPath, destinationPath);
        };

        // Since trying to overwrite the link with spit out an error, we need to delete it first
        if (await destFile.exists()) {
          await destFile.delete().then(async () => {
            await copyFunc();
          });
        } else {
          await copyFunc();
        }
      };

      assetPaths.forEach(async (path) => {
        const originPath = `${Directory.ASSETS}/${path}`;
        const destinationPath = `${Directory.BUNDLED_STORY}/${path}`;

        await fastCopyFile(originPath, destinationPath);
      });

      if (mode == "development") {
        const subscription = watcher.subscribe(
          Directory.ASSETS,
          async (_, events) => {
            events.forEach(async (e) => {
              const path = trimFilePath(e.path);
              const destinationPath = `${
                Directory.BUNDLED_STORY
              }/${path.replace(Directory.ASSETS.replace(".", ""), "")}`;

              if (e.type == "create" || e.type == "update") {
                if (!path.includes(appStr)) {
                  await fastCopyFile(path, destinationPath);
                }
              } else {
                // It's a deleted file so also delete it from the output
                rm(destinationPath, {}).catch(() => {
                  `File at path, ${path}, doesn't exist. Skipping.`;
                });
              }
            });
          }
        );
        process.on("SIGINT", async () => {
          await (await subscription).unsubscribe();
          process.exit(0);
        });
      }
    });
  },
};
