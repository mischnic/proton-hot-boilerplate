const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    main: './index.js',
  },

  context: __dirname,
  node: {
    __filename: false,
    __dirname: false
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },

  target: 'node',
  mode: 'development',
  externals: [nodeExternals()]
};