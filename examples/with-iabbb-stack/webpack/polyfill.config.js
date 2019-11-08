'use strict';

const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  entry: `./src/apps/Polyfill/index.js`,
  output: {
    path: settings.fullDistPath,
    publicPath: settings.publicPath,
    filename: settings.isDev ? `polyfill.js` : `polyfill.[contenthash].js`,
    pathinfo: settings.isVerbose,
    chunkFilename: settings.isDev ? `polyfill.js` : `polyfill.[contenthash].js`,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/env',
                {
                  useBuiltIns: 'entry',
                  corejs: '3',
                  targets: {
                    browsers: ['ie 11'],
                  },
                  debug: false,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new AssetsPlugin({
      path: settings.fullDistPath,
      filename: `polyfill.assets.json`,
      prettyPrint: true,
    }),
  ],
};
