const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: './src/entry-client.js',
  devtool: 'inline-source-map',
  plugins: [new VueSSRClientPlugin()]
})
