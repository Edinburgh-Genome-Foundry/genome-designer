var path    = require('path');
var webpack = require('webpack');
var webpackBase = require('./webpack.config.base');

module.exports = Object.assign({}, webpackBase, {
  devtool: 'cheap-module-eval-source-map',
  entry  : [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output : {
    path      : path.join(__dirname, 'dist'),
    filename  : 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('dev')
      }
    })
  ],
  module : {
    loaders: [
      // **IMPORTANT** This is needed so that each bootstrap js file required by
      // bootstrap-webpack has access to the jQuery object
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      {
        test   : /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      },
      // from bootstrap-webpack https://github.com/gowravshekar/bootstrap-webpack
      {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {
        test  : /\.css$/,
        loader: 'style-loader/useable!css-loader!postcss-loader'
      }
    ]
  }
});
