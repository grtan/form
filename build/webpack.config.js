const path = require('path')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: {
    vcform: './src/index.js'
  },
  output: {
    path: path.resolve(process.cwd(), './dist'),
    filename: '[name].js',
    library: 'VCForm',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.ts', 'tsx', '.js', 'jsx', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  externals: [nodeExternals()],
  optimization: {
    minimize: false
  },
  module: {
    noParse(request) {
      // 不解析生成tinymce资源的js
      return /\/richtext\/generate-resource\.js$/.test(request)
    },
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(less|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(), new ProgressBarPlugin(), new VueLoaderPlugin()]
}
