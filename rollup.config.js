import scss from 'rollup-plugin-scss'

export default {
    input: 'src/main.js',
    output: {
      file: 'extension/runtime.js',
      format: 'cjs'
    },
    treeshake: false
}