/* eslint-disable global-require */
const i18n = require('./i18n.config');
/**
 * Client and Server configs are required.
 * All other configs listed are considered optional and must me opted-in with `--polyfil` or `--headerfooter` and will not be watched.
 */
module.exports = {
  configs: {
    client: ({ createWebpackConfig }) => {
      const createConfig = require('./webpack/website.config.js');
      return i18n.locales.map((locale) => {
        const appConfig = createConfig(locale);
        return createWebpackConfig(appConfig);
      });
    },
    server: ({ createWebpackConfig }) => {
      const createConfig = require('./webpack/server.config.js');
      return createWebpackConfig(createConfig());
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
};
