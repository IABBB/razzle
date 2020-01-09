const AssetsPlugin = require('assets-webpack-plugin');

module.exports = ({ mode = 'development', outputPath, outputPublicPath }) => {
  const IS_DEV = mode === 'development';
  const name = 'polyfill';
  return {
    target: 'web',
    name,
    mode,
    entry: require.resolve('../src/client/apps/Polyfill/index.js'),
    output: {
      path: outputPath,
      publicPath: outputPublicPath,
      filename: IS_DEV ? `js/${name}/[name].js` : `js/${name}/[name].[contenthash].js`,
      pathinfo: IS_DEV,
      chunkFilename: IS_DEV ? `js/${name}/[name].js` : `js/${name}/[name].[contenthash].js`,
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
