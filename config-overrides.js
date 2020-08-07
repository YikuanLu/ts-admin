const {
  override,
  overrideDevServer,
  fixBabelImports
} = require('customize-cra')
const webpackConfig = require('./config/webpack.config')

const addWebpackModules = () => (config, env) => {
  config.resolve.alias = { ...webpackConfig.resolve.alias }
  return config
}

const addCustomize = webpackConfig.addCustomize
const addProxy = webpackConfig.addProxy

module.exports = {
  webpack: override(
    addWebpackModules(),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css'
    }),
    addCustomize()
  ),
  devServer: overrideDevServer(addProxy())
}
