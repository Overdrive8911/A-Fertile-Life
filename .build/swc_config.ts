import { type Options } from '@swc/core'

import { loadConfig } from './handle_config.ts'
const mode = process.env.NODE_ENV || 'development'

const config = await loadConfig()

const swcOptions: Options = {
  jsc: {
    parser: {
      syntax: 'typescript',
      // tsx: false,
      // decorators: true,
    },
    // target: 'es2024',
    minify:
      mode === 'production'
        ? {
            mangle: true,
            format: {
              comments: false,
            },
            compress: {
              defaults: true,
              evaluate: true,
              inline: 3,
              booleans: true,
              booleans_as_integers: true,
              drop_debugger: true,
              dead_code: true,
              if_return: true,
              join_vars: true,
              passes: 2,
              // ecma: 'es2024',
            },
          }
        : undefined,
    transform: {
      treatConstEnumAsEnum: false,
    },
  },
  env: {
    targets: config.builder!.compilation_target,
  },
  module: { type: 'es6' },
}

export default swcOptions
