import { build, write, $ } from 'bun'
import {
  bundleScriptAndStyleExtensions,
  cleanDirectories,
  copyOtherAssets,
  processStyles,
} from './.build/plugins'
import { Directory, mode } from './.build/variables'
import watcher from '@parcel/watcher'
import { setupTweego } from 'tweenode'

const buildResult = await build({
  entrypoints: [Directory.SCRIPT_ENTRYPOINT + ''],
  outdir: Directory.BUNDLED_SCRIPTS_DIR + '',
  minify: mode === 'production',
  plugins: [
    cleanDirectories,
    processStyles,
    bundleScriptAndStyleExtensions,
    copyOtherAssets,
  ],
  drop: ['console', 'window'],
})

if (mode == 'development') {
  let subscription = watcher.subscribe(Directory.APP, async (err, events) => {
    events.forEach(async e => {
      if (e.path.endsWith('.ts')) {
        await build({
          entrypoints: [Directory.SCRIPT_ENTRYPOINT + ''],
          outdir: Directory.BUNDLED_SCRIPTS_DIR + '',
        })
      }
    })
  })

  process.on('SIGINT', async () => {
    await (await subscription).unsubscribe()
    process.exit(0)
  })
}

if (buildResult) {
  setupTweego().finally(async () => {
    await compileStory()
  })
  // const tweego = new Tweenode({ writeToLog: true })

  async function compileStory() {
    //ANCHOR: The only reason I'm manually using a terminal command is because `tweenode` occasionally errors out with no reasonable logs >~<
    await $`cd .tweenode && ./tweego --head=../${
      Directory.HEAD_CONTENT
    } --module=../${Directory.VENDOR} ${
      mode == 'development' ? '-t' : ''
    } --output=../${Directory.BUNDLED_STORY_NAME} ../${Directory.STORY} ../${
      Directory.BUNDLED_SCRIPTS_DIR
    } ../${Directory.BUNDLED_STYLES_DIR}`

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

  if (mode == 'development') {
    const subscription = watcher.subscribe(Directory.OUTPUT, async () => {
      await compileStory()
      // A hacky way to force the live reload server to respond to this change if it doesn't detect the `index.html` change
      // await write(
      //   `${Directory.BUNDLED_STORY}${Directory.STORY_MEDIA}/dummy.txt`,
      //   'Dummy'
      // )
    })

    process.on('SIGINT', async () => {
      await (await subscription).unsubscribe()
      process.exit(0)
    })
  }

  await compileStory()
}

export {}
