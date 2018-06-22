const path = require('path');
const nodeExternals = require('webpack-node-externals');

const babelrc = JSON.parse(require("fs").readFileSync(".babelrc"));
babelrc.plugins = babelrc.plugins || [];
babelrc.plugins.push(path.join(__dirname, 'babel.js'),);

module.exports = {
  entry: {
    main: './src/index.js',
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
        use: {
          loader: 'babel-loader',
          options: babelrc
        }
      }
    ]
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },

  stats: 'minimal',

  target: 'node',
  mode: 'development',
  externals: [nodeExternals()]
};