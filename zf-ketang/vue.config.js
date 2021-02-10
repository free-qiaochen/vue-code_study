const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const apiMocker = require('mocker-api');

module.exports = {
  publicPath: '/',
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度

  configureWebpack: config => {
    let pluginArr = []
    if (process.env.npm_config_analyze) {
      pluginArr.push(new BundleAnalyzerPlugin())
    }
    return {
      // 压缩代码
      // plugins: [createThemeColorReplacerPlugin(), compress] //加载换肤功能
      plugins: pluginArr
    }
  },
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
  },
  devServer: {
    before (app) {
      apiMocker(app, path.resolve(__dirname, './mocker/index.js'), {
        proxy: {
          '/zfkt-api': 'localhost:8080/api',
        },
        changeHost: true,
      })
    }
  }
}
