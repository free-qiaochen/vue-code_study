const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, 'src/assets/common.scss')]
    }
  },
  // 配置px2rem，rem的基准html的fontSize
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-plugin-px2rem")({
            rootValue: 75,
            // exclude: /node_module/,
          })
        ]
      }
    }
  }
}
