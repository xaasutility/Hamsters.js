const path = require('path');
const webpack = require('webpack');


const optimizingPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin,
  new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
  }),
];

const web = {
  target: 'web',
  devtool: 'sourcemap',
  context: path.resolve(__dirname, 'src'),
  entry: [
    './hamsters'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'hamsters.web.min.js',
    library: 'hamsters',
    libraryTarget: 'var'
  },
  plugins: optimizingPlugins,
  module: {
    loaders: [
      {
        test: [/\.js?$/],
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel',
        query: {
          presets: ['es2015'],
        }
      }
    ]
  }
};

const node = {
  target: 'node',
  devtool: 'sourcemap',
  context: path.resolve(__dirname, 'src'),
  entry: [
    './hamsters'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'hamsters.node.min.js',
    library: 'hamsters',
    libraryTarget: 'commonjs2'
  },
  plugins: optimizingPlugins,
  module: {
    loaders: [
      {
        test: [/\.js?$/],
        exclude: path.resolve(__dirname, 'node_modules'),
        loader: 'babel',
        query: {
          presets: ['es2015'],
        }
      }
    ]
  }
};

module.exports = [
  web,
  node
];