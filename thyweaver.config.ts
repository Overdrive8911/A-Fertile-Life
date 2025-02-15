import {
  defineConfig,
  defaultConfig,
  type ThyWeaverConfig,
} from './.build/handle_config.ts'

const config = defineConfig<ThyWeaverConfig>({
  dev_server: {
    hostname: 'localhost',
    port: 3001,
    twine_debug: true,
  },
  builder: {
    ...defaultConfig.builder,
    enableFSLinkCopyOnDevMode: false,
    compilation_target: 'defaults',
    watcherDelay: 1000,
    additionalAssets: [],
  },
})

export default config
