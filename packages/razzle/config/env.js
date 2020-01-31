/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
const fs = require('fs');
const paths = require('./paths');

// Make sure that including paths.js after env.js will read .env variables.
delete require.cache[require.resolve('./paths')];

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error('The NODE_ENV environment variable is required but was not specified.');
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  `${paths.dotenv}.local`,
  paths.dotenv,
];

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
const configuredCount = dotenvFiles.reduce((acc, dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv').config({
      path: dotenvFile,
    });
    acc++;
  }

  return acc;
}, 0);

if (!configuredCount) {
  throw new Error('A .env file is required, but was not found.');
}

// NODE_PATH is not supported since a resolver is assumed to be part of the projects base webpack config
// // We support resolving modules according to `NODE_PATH`.
// // This lets you use absolute paths in imports inside large monorepos:
// // https://github.com/facebookincubator/create-react-app/issues/253.
// // It works similar to `NODE_PATH` in Node itself:
// // https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// // Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// // Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// // https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// // We also resolve them to make sure all tools using them work consistently.
// const appDirectory = fs.realpathSync(process.cwd());
// const nodePath = (process.env.NODE_PATH || '')
//   .split(path.delimiter)
//   .filter((folder) => folder && !path.isAbsolute(folder))
//   .map((folder) => path.resolve(appDirectory, folder))
//   .join(path.delimiter);

// eslint-disable-next-line camelcase
// const getDEV_SERVER_PORT = () => process.env.DEV_SERVER_PORT || parseInt(process.env.PORT, 10) + 1;

// Grab NODE_ENV and RAZZLE_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const RAZZLE = /^RAZZLE_/i;
/**
 * Not just used by the client
 * @param {string} target 'web' or 'node'
 * @param {Object} options options to determine the default process variables
 */
function getClientEnvironment() {
  const raw = Object.keys(process.env)
    .filter((key) => RAZZLE.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'production',
        PORT: process.env.PORT,
        VERBOSE: !!process.env.VERBOSE,
        HOST: process.env.HOST,
        // Build directory absolute path. Build directory contains everything that is outputed from webpcak and includes the public folder
        BUILD_DIR: paths.appBuild,
        PUBLIC_DIR: paths.appBuildPublic,
        ASSETS_PUBLIC_DIR: paths.appBuildPublicAssets,
        // These are webpack variables
        ASSETS_PUBLIC_PATH: process.env.ASSETS_PUBLIC_PATH || '/dist',
        SERVER_PUBLIC_PATH: process.env.SERVER_PUBLIC_PATH || '/',
      },
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = Object.keys(raw).reduce((env, key) => {
    env[`process.env.${key}`] = JSON.stringify(raw[key]);
    return env;
  }, {});

  return { raw, stringified };
}

module.exports = {
  getClientEnv: getClientEnvironment,
  // nodePath,
};
