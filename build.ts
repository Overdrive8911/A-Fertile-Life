import { build, write, $, sleep, type BuildConfig } from "bun";
import {
  bundleScriptAndStyleExtensions,
  cleanDirectories,
  copyOtherAssets,
  scssToCss,
} from "./.build/plugins";
import { mode } from "./.build/variables";
import { Directory } from "./.build/enums";
import watcher from "@parcel/watcher";
import { setupTweego } from "tweenode";

const buildConfig: BuildConfig = {
  entrypoints: [Directory.SCRIPT_ENTRYPOINT + ""],
  outdir: Directory.BUNDLED_SCRIPTS_DIR + "",
  minify: mode === "production",
  plugins: [
    cleanDirectories,
    scssToCss,
    // bundleScriptAndStyleExtensions,
    copyOtherAssets,
  ],
  drop: mode === "production" ? ["console", "window"] : [],
  naming: {
    asset: "assets/[name]-[hash].[ext]",
  },
};
const buildResult = await build(buildConfig);

if (mode == "development") {
  const tryBuild = async () => {
    try {
      await build(buildConfig);
    } catch (error) {
      console.log("Build failed. Error:", error);
      console.log("Retrying in 5s");
      sleep(5000).finally(async () => {
        await tryBuild();
      });
    }
  };
  let subscription = watcher.subscribe(Directory.APP, async (_, events) => {
    events.forEach(async (e) => {
      if (e.path.endsWith(".ts")) {
        await tryBuild();
      }
    });
  });

  process.on("SIGINT", async () => {
    await (await subscription).unsubscribe();
    process.exit(0);
  });
}

if (buildResult) {
  setupTweego().finally(async () => {
    await compileStory();
  });
  // const tweego = new Tweenode({ writeToLog: true })

  async function compileStory() {
    //ANCHOR: The only reason I'm manually using a terminal command is because `tweenode` occasionally errors out with no reasonable logs >~<
    await $`cd .tweenode && ./tweego --head=../${
      Directory.HEAD_CONTENT
    } --module=../${Directory.VENDOR} ${
      mode == "development" ? "-t" : ""
    } --output=../${Directory.BUNDLED_STORY_NAME} ../${Directory.STORY} ../${
      Directory.BUNDLED_SCRIPTS_DIR
    }`; // ../${Directory.BUNDLED_STYLES_DIR}`;

    // write(Directory.BUNDLED_STORY_NAME, blob())
    // await tweego.process({
    //   input: {
    //     storyDir: Directory.STORY,
    //     useTwineTestMode: mode == 'development' ? true : false,
    //     htmlHead: Directory.HEAD_CONTENT,
    //     modules: [Directory.VENDOR],
    //     scripts: Directory.BUNDLED_SCRIPTS_DIR,
    //     styles: Directory.BUNDLED_STYLES_DIR,
    //   },
    //   // output: { fileName: Directory.BUNDLED_STORY_NAME, mode: 'file' },
    //   output: { mode: 'file', fileName: Directory.BUNDLED_STORY_NAME },
    // })
  }

  if (mode == "development") {
    const subscription = watcher.subscribe(Directory.OUTPUT, async () => {
      await compileStory();
      // // A hacky way to force the live reload server to respond to this change if it doesn't detect the `index.html` change
      // await write(
      //   `${Directory.BUNDLED_STORY}${Directory.STORY_MEDIA}/dummy.txt`,
      //   "Dummy"
      // );
    });

    // const subscription2 = watcher.subscribe(Directory.STORY, async () => {
    //   await compileStory();
    //   // // A hacky way to force the live reload server to respond to this change if it doesn't detect the `index.html` change
    //   // await write(
    //   //   `${Directory.BUNDLED_STORY}${Directory.STORY_MEDIA}/dummy.txt`,
    //   //   "Dummy"
    //   // );
    // });

    process.on("SIGINT", async () => {
      await (await subscription).unsubscribe();
      // await (await subscription2).unsubscribe();
      process.exit(0);
    });
  }

  await compileStory();
}

export {};
