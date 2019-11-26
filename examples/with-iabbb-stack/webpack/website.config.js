'use strict';

const i18n = require('../i18n.config');

const config = locale => ({
  target: 'web',
  name: `site_${locale}`,
  entry: require.resolve('../src/apps/Website/index.js'),
  module: {
    rules: [
      {
        resourceQuery: /i18n/,
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
