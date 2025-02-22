import { build } from 'bun'
import {
  bundleScriptAndStyleExtensions,
  cleanDirectories,
  copyOtherAssets,
  processStyles,
  runTweego,
} from './.build/plugins'
import { Directory, mode } from './.build/variables'
import { watch } from 'fs-extra'
// NOTE: None of the file watchers detect file deletions so keep that in mind, your best bet would be to rebuild the project

// // Add explicit dependencies to the entry point so bun's build watcher will reload when these change
// await import(Directory.SCRIPT_ENTRYPOINT)
// await import(Directory.STYLE_ENTRYPOINT)

await build({
  entrypoints: [Directory.SCRIPT_ENTRYPOINT],
  outdir: Directory.BUNDLED_SCRIPTS_DIR,
  minify: mode === 'production',
  plugins: [cleanDirectories, bundleScriptAndStyleExtensions, copyOtherAssets],
  naming: {
    entry: '[name].[ext]',
    chunk: '[name]-[hash].[ext]',
    asset: 'assets/[name]-[hash].[ext]',
  },
  // drop: mode === 'production'?['console', 'debugger']:[],
})

await build({
  entrypoints: [Directory.STYLE_ENTRYPOINT],
  outdir: Directory.BUNDLED_STYLES_DIR,
  minify: mode === 'production',
  plugins: [runTweego, processStyles],
  naming: {
    entry: '[name].[ext]',
    chunk: '[name]-[hash].[ext]',
    asset: 'assets/[name]-[hash].[ext]',
  },
  loader: {
    '.webp': 'file',
    '.svg': 'file',
    '.ttf': 'file',
  },
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
          naming: {
            entry: '[name].[ext]',
            chunk: '[name]-[hash].[ext]',
            asset: 'assets/[name]-[hash].[ext]',
          },
        })
      } else if (filename?.endsWith('.scss')) {
        await build({
          entrypoints: [Directory.STYLE_ENTRYPOINT],
          outdir: Directory.BUNDLED_STYLES_DIR,
          naming: {
            entry: '[name].[ext]',
            chunk: '[name]-[hash].[ext]',
            asset: 'assets/[name]-[hash].[ext]',
          },

          loader: {
            '.webp': 'file',
            '.svg': 'file',
            '.ttf': 'file',
          },
        })
      }

      // console.log(`Detected ${event} in ${filename} (src)`)
    }
  )

  process.on('SIGINT', () => {
    watcher.close()
    process.exit(0)
  })
}

export {}
