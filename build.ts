import { build, sleep, write } from 'bun'
import {
  bundleScriptAndStyleExtensions,
  cleanDirectories,
  copyOtherAssets,
  processStyles,
} from './.build/plugins'
import { Directory, mode } from './.build/variables'
import { watch } from 'fs-extra'
import { setupTweego, Tweenode } from 'tweenode'
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
  await setupTweego()
  const tweego = new Tweenode()

  const compileStory = async () => {
    await tweego.process({
      input: {
        storyDir: Directory.STORY,
        useTwineTestMode: mode == 'development' ? true : false,
        htmlHead: Directory.HEAD_CONTENT,
        modules: [Directory.VENDOR],
        scripts: Directory.BUNDLED_SCRIPTS_DIR,
        styles: Directory.BUNDLED_STYLES_DIR,
      },
      // output: { fileName: Directory.BUNDLED_STORY_NAME, mode: 'file' },
      output: { mode: 'file', fileName: Directory.BUNDLED_STORY_NAME },
    })
  }

  if (mode == 'development') {
    const watcher = watch(Directory.OUTPUT, { recursive: true }, async () => {
      await compileStory()
    })

    process.on('SIGINT', () => {
      watcher.close()
      process.exit(0)
    })
  }

  await compileStory()
})

export {}
