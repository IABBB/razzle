const i18n = require('../i18n.config');

const config = (locale) => ({
  name: `site_${locale}`,
  entry: require.resolve('../src/apps/Website/client.js'),
  module: {
    rules: [
      {
        type: 'javascript/auto', // needed to ignore webpack's builtin json-loader
        exclude: /node_modules/,
        test: /i18n\.json$/,
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
