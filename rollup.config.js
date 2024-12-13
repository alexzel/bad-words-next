import fs from 'node:fs'
import path from 'node:path'

import babel from '@rollup/plugin-babel'
import del from 'rollup-plugin-delete'
import typescript from '@rollup/plugin-typescript';

const packageJson = JSON.parse(fs.readFileSync('./package.json'))

export default [
  {
    input: Object.fromEntries(
      Object.keys(packageJson.exports).map((chunk) => {
        const source = packageJson.exports[chunk].default
          .replace("/lib/", "/src/")
          .replace(".mjs", ".ts");
        const entry = source.replace(/\.\/src\/|\.ts/g, "");
        return [entry, source];
      }),
    ),
    output: [
      {
        dir: 'lib',
        format: 'es',
        preserveModules: true,
        entryFileNames: '[name].mjs'
      },
      {
        dir: 'lib',
        format: 'cjs',
        preserveModules: true,
        entryFileNames: '[name].cjs'
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
      }),
      typescript({tsconfig: './tsconfig.build.json'})
    ],
  }
]
