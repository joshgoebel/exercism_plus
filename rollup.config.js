import scss from 'rollup-plugin-scss'

let scssPlugin = scss({
  output: "extension/styles.css",
  prefix: `@import "./colors.scss";`,
})
let transform = scssPlugin.transform
scssPlugin.transform = function(...args) {
  this.addWatchFile('src/css');
  return transform(...args)
}

export default {
    input: 'src/main.js',
    output: {
      file: 'extension/runtime.js',
      format: 'cjs'
    },
    plugins: [
      scssPlugin
    ],
    treeshake: false
}