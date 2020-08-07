// webpack.config.js
const path = require('path')
const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  addCustomize: () => (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization = {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: 10
            },
            default: {
              minChunks: 2,
              priority: -10,
              reuseExistingChunk: true
            }
          }
        }
      }

      // 关闭sourceMap
      config.devtool = false
      // 添加js打包gzip配置
      config.plugins.push(
        new CompressionWebpackPlugin({
          test: /\.js$|\.css$/,
          threshold: 1024
        }),
        new webpack.optimize.AggressiveMergingPlugin(), //合并块
        new webpack.optimize.ModuleConcatenationPlugin()
      )
    }
    return config
  },
  addProxy: () => (config) => {
    config.proxy = {
      // '/sport': {
      //   target: 'http://192.168.0.27:8086',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/sport': ''
      //   }
      // },
      // '/aggregation': {
      //   target: 'http://192.168.0.27:8082',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/aggregation': ''
      //   }
      // },
      '/': {
        target: 'http://192.168.0.8/',
        changeOrigin: true
      }
    }

    return config
  }
}
