const AssetsPlugin = require('assets-webpack-plugin');

module.exports = ({ mode = 'development', outputPath, outputPublicPath }) => {
  const IS_DEV = mode === 'development';
  return {
    target: 'web',
    name: 'polyfill',
    mode,
    entry: require.resolve('../src/apps/Polyfill/index.js'),
    output: {
      path: outputPath,
      publicPath: outputPublicPath,
      filename: IS_DEV ? `polyfill.js` : `polyfill.[contenthash].js`,
      pathinfo: IS_DEV,
      chunkFilename: IS_DEV ? `polyfill.js` : `polyfill.[contenthash].js`,
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
        path: outputPath,
        filename: `polyfill.assets.json`,
        prettyPrint: true,
      }),
    ],
  };
};
