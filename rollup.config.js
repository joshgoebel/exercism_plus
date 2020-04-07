import scss from 'rollup-plugin-scss'
// import typescript from '@rollup/plugin-typescript';
import typescript from 'rollup-plugin-typescript2';


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
    input: 'src/main.ts',
    output: {
      file: 'extension/runtime.js',
      format: 'cjs'
    },
    // output: {
    //   dir: 'output',
    //   format: 'cjs'
    // },
    plugins: [
      scssPlugin,
      typescript()
      // typescript({ include: ["src/editor.js"]})
        // exclude: "output/**",
        // include: "src/**"
      // }),
    ],
    treeshake: false
}