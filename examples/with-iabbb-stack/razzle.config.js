const i18n = require('./i18n.config');

module.exports = {
  configs: {
    website: ({ createWebpackConfig }) => {
      const createConfig = require('./webpack/website.config.js');
      return i18n.locales.map((locale) => {
        const appConfig = createConfig(locale);
        return createWebpackConfig(appConfig);
      });
    },
    polyfill: ({ paths, dotenv }) =>
      require('./webpack/polyfill.config.js')({
        mode: dotenv.raw.NODE_ENV,
        outputPath: paths.appBuild,
        outputPublicPath: dotenv.raw.CLIENT_PUBLIC_PATH,
      }),
    headerfooter: ({ createWebpackConfig }) => {
      const createConfig = require('./webpack/headerfooter.config.js');
      return i18n.locales.map((locale) => {
        const appConfig = createConfig(locale);
        return createWebpackConfig(appConfig);
      });
    },
  },
  scripts: {
    start: {
      ssr: ['website'], // create an ssr bundle
      build: ['website', 'headerfooter'],
      optional: ['polyfill'],
      devClient: ['website'],
    },
    build: {
      ssr: ['website'],
      build: ['website', 'headerfooter', 'polyfill'],
    },
  },
};
