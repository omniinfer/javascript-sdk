import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from '@rollup/plugin-json';
import pkg from './package.json' assert { type: 'json' };

export default {
  input: "index.ts",
  output: {
    name: "@omniinfer/sdk",
    file: pkg.browser,
    format: "umd",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    babel({ babelHelpers: "bundled" }),
  ],
};
