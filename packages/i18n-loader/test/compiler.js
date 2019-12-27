const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');

module.exports = (fixture, options = {}) => {
  const compiler = webpack({
    // mode: 'development', // If set to development will fail test, but useful for testing
    context: __dirname,
    entry: `${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.m?js?$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: ['@babel/preset-env'],
                // presets: ['@iabbb/babel-preset-iabbb'], // Enable to test against IABBB babel-preset
              },
            },
          ],
        },
        {
          type: 'javascript/auto', // to avoid default JSON loader
          test: /\\text\\i18n\.json$/,
          use: {
            loader: path.resolve(__dirname, '../src/index.js'),
            options,
          },
        },
      ],
    },
  });

  compiler.outputFileSystem = new MemoryFS(); // Disable to write to './bundle.js'

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors));

      resolve(stats);
    });
  });
};
