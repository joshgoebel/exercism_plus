import scss from 'rollup-plugin-scss'

export default {
    input: 'src/main.js',
    output: {
      file: 'extension/runtime.js',
      format: 'cjs'
    },
    plugins: [
      scss({
        output: "extension/styles.css",
        prefix: `@import "./colors.scss";`,
        watch: 'src/css'
      })
    ],
    treeshake: false
}