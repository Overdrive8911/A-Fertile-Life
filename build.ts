import { build, sleep, write, $ } from 'bun'
import {
  bundleScriptAndStyleExtensions,
  cleanDirectories,
  copyOtherAssets,
  processStyles,
} from './.build/plugins'
import { Directory, mode } from './.build/variables'
import { watch } from 'fs-extra'
import { setupTweego } from 'tweenode'
// NOTE: None of the file watchers detect file deletions so keep that in mind, your best bet would be to rebuild the project

// // Add explicit dependencies to the entry point so bun's build watcher will reload when these change
// await import(Directory.SCRIPT_ENTRYPOINT)
// await import(Directory.STYLE_ENTRYPOINT)
const buildResult = await build({
  entrypoints: [Directory.SCRIPT_ENTRYPOINT],
  outdir: Directory.BUNDLED_SCRIPTS_DIR,
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
  const watcher = watch(
    Directory.APP,
    { recursive: true },
    async (event, filename) => {
      if (filename?.endsWith('.ts')) {
        await build({
          entrypoints: [Directory.SCRIPT_ENTRYPOINT],
          outdir: Directory.BUNDLED_SCRIPTS_DIR,
        })
      }
    }
  )

  process.on('SIGINT', () => {
    watcher.close()
    process.exit(0)
  })
}

sleep(2000).finally(async () => {
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
    const watcher = watch(Directory.OUTPUT, { recursive: true }, async () => {
      await compileStory()
      // A hacky way to force the live reload server to respond to this change if it doesn't detect the `index.html` change
      await write(
        `${Directory.BUNDLED_STORY}${Directory.STORY_MEDIA}/dummy.txt`,
        'Dummy'
      )
    })

    process.on('SIGINT', () => {
      watcher.close()
      process.exit(0)
    })
  }

  await compileStory()
})

export {}
