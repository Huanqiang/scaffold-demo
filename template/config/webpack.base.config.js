const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const reslove = file => path.resolve(__dirname + '/' + file)

module.exports = {
  entry: './src/index.js',
  output: {
    path: reslove('../dist/'),
    filename: '[name].app.js',
    chunkFilename: '[name].app.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: reslove('../index.template.html')
    })
  ]
  // devServer: {
  //   historyApiFallback: true
  // }
}
