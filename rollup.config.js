import babel from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'

const MAIN_FILE = 'index'

export default [
  {
    input: `src/${MAIN_FILE}.ts`,
    output: [
      {
        file: `lib/${MAIN_FILE}.js`,
        format: 'esm',
        exports: 'default'
      },
      {
        file: `lib/${MAIN_FILE}.cjs`,
        format: 'cjs',
        exports: 'auto'
      }
    ],
    external: [
      'moize',
      'confusables'
    ],
    plugins: [
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
      format: 'esm'
    },
    plugins: [
      dts()
    ]
  }
]
