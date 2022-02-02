import { readdirSync } from 'fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

const list = readdirSync('./src');

module.exports = [
  ...list.map((name) => {
    return {
      input: `./src/${name}/index.ts`,
      external: ['jinkela'],
      output: [
        {
          file: `./dist/${name}/index.iife.js`,
          name: 'jkl.' + name,
          format: 'iife',
          globals: { jinkela: 'Jinkela' },
        },
        {
          file: `./dist/${name}/index.esm.js`,
          format: 'esm',
          globals: { jinkela: 'jinkela' },
        },
        {
          file: `./dist/${name}/index.cjs.js`,
          format: 'cjs',
          globals: { jinkela: 'jinkela' },
        },
      ],
      plugins: [
        nodeResolve(),
        typescript({
          tsconfigOverride: {
            include: [`src/${name}`, 'types.d.ts'],
          },
        }),
        terser(),
      ],
    };
  }),
];
