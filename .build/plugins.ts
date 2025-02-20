import { file, Glob, Transpiler, write, type BunPlugin } from 'bun'
import * as sass from 'sass-embedded'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import CleanCSS from 'clean-css'
import { watch } from 'node:fs'
import { Directory, mode } from './variables'
import { setupTweego, Tweenode } from 'tweenode'
import { link, mkdir, rm } from 'node:fs/promises'
import { dirname } from 'node:path'

export const cleanDirectories: BunPlugin = {
  name: 'Clean Directories',
  setup(build) {
    build.onStart(async () => {
      const cleanDir = async (dir: string) => {
        rm(dir, { recursive: true, force: true }).finally(async () => {
          await mkdir(dir, { recursive: true })
        })
      }

      await cleanDir(Directory.OUTPUT)
      await cleanDir(Directory.BUNDLED_STORY)
    })
  },
}

// As of 06 / 02 / 2025, Bun can't directly watch over the changes of scss files so this should help enough
// TODO: Add error handling
async function convertSCSSFileToCSS(filePath: string) {
  const convertedCSS = (await sass.compileAsync(filePath)).css

  if (mode == 'production') {
    return await processCSS(convertedCSS, filePath)
  } else return convertedCSS
}
async function processCSS(cssString: string, filePath?: string) {
  // Process the CSS with PostCSS and autoprefixer
  const processedCSS = (
    await postcss([autoprefixer]).process(cssString, {
      from: filePath,
      to: filePath?.replace(/\.scss$/, '.css'),
    })
  ).css

  // Minify the CSS using CleanCSS
  return new CleanCSS().minify(processedCSS).styles
}

export const processStyles: BunPlugin = {
  name: 'Process Game Styles',
  setup(build) {
    build.onLoad({ filter: /\.scss$/ }, async args => {
      if (/*watchSASS*/ mode == 'development') {
        const watcher = watch(
          Directory.STYLES,
          { recursive: true },
          async () => {
            // Replace the css file
            await Bun.write(
              Directory.BUNDLED_STYLES,
              await convertSCSSFileToCSS(args.path)
            )
          }
        )
        process.on('SIGINT', () => {
          watcher.close()
          process.exit(0)
        })
      }

      return { contents: await convertSCSSFileToCSS(args.path), loader: 'css' }
    })
  },
}

const getFilePathsRecursivelyFromDirectory = async (
  fileGlobPattern: string,
  dirToSearch?: string
) => {
  const glob = new Glob(fileGlobPattern)
  const filePaths: string[] = []

  // Scans the current working directory and each of its sub-directories recursively
  for await (const filePath of glob.scan(dirToSearch ?? '.')) {
    filePaths.push(filePath)
  }
  return filePaths
}

// TODO: Add watch support
export const bundleScriptAndStyleExtensions: BunPlugin = {
  name: 'Bundle JS and CSS extensions',
  setup(build) {
    build.onLoad({ filter: /\.(css|js)$/ }, async () => {
      const jsFilePaths = await getFilePathsRecursivelyFromDirectory(
        '**/*.js',
        Directory.SCRIPT_EXTENSIONS
      )
      const cssFilePaths = await getFilePathsRecursivelyFromDirectory(
        '**/*.css',
        Directory.STYLE_EXTENSIONS
      )

      const processContentOfFiles = async (
        filePaths: string[],
        fileType: 'css' | 'js'
      ) => {
        const scriptTranspiler = new Transpiler({
          inline: true,
          deadCodeElimination: true,
          minifyWhitespace: true,
        })

        filePaths.forEach(async path => {
          const combinedPath = `${
            fileType == 'css'
              ? Directory.STYLE_EXTENSIONS
              : Directory.SCRIPT_EXTENSIONS
          }/${path}`
          let fileText = await file(combinedPath).text()

          // Processing
          if (mode == 'production') {
            if (fileType == 'css') {
              fileText = await processCSS(fileText)
            } else {
              fileText = scriptTranspiler.transformSync(fileText)
            }
          }

          const sanitizedPath = path.replace('/', '_')
          write(
            fileType == 'css'
              ? `${Directory.BUNDLED_STYLES_DIR}/${sanitizedPath}`
              : `${Directory.BUNDLED_SCRIPTS_DIR}/${sanitizedPath}`,
            fileText
          )
        })
      }

      await processContentOfFiles(cssFilePaths, 'css')
      await processContentOfFiles(jsFilePaths, 'js')

      if (mode == 'development') {
        const scriptWatcher = watch(
          Directory.SCRIPT_EXTENSIONS,
          { recursive: true },
          async (event, filename) => {
            if (filename) {
              await processContentOfFiles([filename], 'js')
            }
          }
        )
        const styleWatcher = watch(
          Directory.SCRIPT_EXTENSIONS,
          { recursive: true },
          async (event, filename) => {
            if (filename) {
              await processContentOfFiles([filename], 'css')
            }
          }
        )
        process.on('SIGINT', () => {
          scriptWatcher.close()
          styleWatcher.close()
          process.exit(0)
        })
      }
    })
  },
}

export const copyOtherAssets: BunPlugin = {
  name: 'Copy Non-Code Assets (e.g audio, fonts, images, etc)',
  setup(build) {
    build.onStart(async () => {
      const appStr = `${Directory.APP}/`.replace(`${Directory.ASSETS}/`, '') // Yeah, don't think too much about this but with the default values, you're meant to get "app/"

      // Skip scripts and styles
      const assetPaths = await getFilePathsRecursivelyFromDirectory(
        `!${appStr}**`, // Ignore all the files in the "app" directory (basically the styles and scripts)
        Directory.ASSETS
      )

      const fastCopyFile = async (
        originPath: string,
        destinationPath: string
      ) => {
        const destFile = file(destinationPath)
        const copyFunc = async () => {
          // Ensure the destination directory exists
          await mkdir(dirname(destinationPath), { recursive: true })

          await link(originPath, destinationPath)
        }

        // Since trying to overwrite the link with spit out an error, we need to delete it first
        if (await destFile.exists()) {
          await destFile.delete().then(async () => {
            await copyFunc()
          })
        } else {
          await copyFunc()
        }
      }

      assetPaths.forEach(async path => {
        const originPath = `${Directory.ASSETS}/${path}`
        const destinationPath = `${Directory.BUNDLED_STORY}/${path}`

        await fastCopyFile(originPath, destinationPath)
      })

      if (mode == 'development') {
        const watcher = watch(
          Directory.ASSETS,
          { recursive: true },
          async (event, filename) => {
            // console.log(event)
            if (!filename?.includes(appStr)) {
              await fastCopyFile(
                `${Directory.ASSETS}/${filename}`,
                `${Directory.BUNDLED_STORY}/${filename}`
              )
            }
          }
        )
        process.on('SIGINT', () => {
          watcher.close()
          process.exit(0)
        })
      }
    })
  },
}

export const runTweego: BunPlugin = {
  name: 'Compile Story with Tweego',
  setup(build) {
    build.onLoad({ filter: /^.*$/ }, async ({ defer }) => {
      // Ensure all scripts, styles and media assets have been dealt with first
      await defer()

      await setupTweego()
      const tweego = new Tweenode()

      const compileStory = async () => {
        const bufferSize = await Bun.write(
          Directory.BUNDLED_STORY_NAME,
          await (tweego.process({
            input: {
              storyDir: Directory.STORY,
              useTwineTestMode: mode == 'development' ? true : false,
              htmlHead: Directory.HEAD_CONTENT,
              modules: [Directory.VENDOR],
              scripts: Directory.BUNDLED_SCRIPTS_DIR,
              styles: Directory.BUNDLED_STYLES_DIR,
            },
            // output: { fileName: Directory.BUNDLED_STORY_NAME, mode: 'file' },
            output: { mode: 'string' },
          }) as Promise<string>)
        )

        if (bufferSize) return true
        else return false
      }

      if (mode == 'development') {
        const watcher = watch(
          Directory.OUTPUT,
          { recursive: true },
          async () => {
            await compileStory()
          }
        )

        process.on('SIGINT', () => {
          watcher.close()
          process.exit(0)
        })
      }

      await compileStory()
    })
  },
}
