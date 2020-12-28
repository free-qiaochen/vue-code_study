import babel from 'rollup-plugin-babel'
// import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js',
  output: {
    format: 'umd',// 支持amd 和 commonjs规范
    name: 'Vue',// window.Vue
    file: 'dist/vue.js',
    sourcemap: true,
  },
  plugins: [
    babel({// 使用babel进行转化
      exclude: 'node_modules/**',  // glob语法，忽略node_modules下所有文件
    })
  ]
}