const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: './src/entry-server.js',
  devtool: 'source-map',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2'
  },
  plugins: [new VueSSRServerPlugin()]
})
