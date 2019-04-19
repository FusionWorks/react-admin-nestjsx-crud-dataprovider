import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import json from 'rollup-plugin-json'

const pkg = require('./package.json');
const entryFile = 'index';

export default {
  input: `src/${entryFile}.js`,
  output: [
    { file: pkg.main, name: entryFile, format: 'umd', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: `/src/${entryFile}.js`,
  },
  plugins: [
    // Allow json resolution
    json(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({
        jail:'/node_modules/',
    }),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
  output: {
    dir: 'dist',
    // "amd", "cjs", "system", "esm", "iife" or "umd".
    format: 'cjs',
    name: 'index'
  }
}