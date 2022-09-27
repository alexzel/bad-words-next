import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'

const MAIN_FILE = 'index'

export default [
  {
    input: `src/${MAIN_FILE}.ts`,
    output: [
      {
        file: `lib/${MAIN_FILE}.mjs`,
        format: 'es',
        exports: 'default'
      },
      {
        file: `lib/${MAIN_FILE}.js`,
        format: 'cjs',
        exports: 'auto'
      }
    ],
    external: [
      'moize',
      'confusables'
    ],
    plugins: [
      nodeResolve(),
      del({ targets: 'lib/*' }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts']
      })
    ]
  },
  {
    input: `src/${MAIN_FILE}.ts`,
    output: {
      file: `lib/${MAIN_FILE}.d.ts`,
      format: 'es'
    },
    plugins: [
      dts()
    ]
  }
]
