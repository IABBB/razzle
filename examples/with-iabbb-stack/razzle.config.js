'use strict';

module.exports = {
  configs: {
    website: require.resolve('./webpack/website.config.js'),
    polyfill: require.resolve('./webpack/polyfill.config.js'),
  },
  scriptOptions: {
    start: {
      optional: 'polyfill',
    },
  },
};
