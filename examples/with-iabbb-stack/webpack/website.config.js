const resolver = require('../resolver');
const i18n = require('../i18n.config');

const config = (locale) => ({
  name: `site_${locale}`,
  // entry: {
  //   [`site_${locale}`]: require.resolve('../src/client/apps/Website/client.js'),
  // },
  entry: require.resolve('../src/client/apps/Website/client.js'),
  target: 'web',
  resolve: resolver.webpack.config.resolve,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        type: 'javascript/auto',
        test: /\\text\\i18n\.json$/,
        loader: require.resolve('@iabbb/i18n-loader'),
        options: {
          defaultLocale: i18n.defaultLocale,
          currentLocale: locale,
        },
      },
    ],
  },
});
module.exports = config;
