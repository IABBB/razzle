// const path = require('path');
// const fs = require('fs-extra');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('@iabbb/razzle-dev-utils/logger');
const isEmpty = require('lodash/isEmpty');
const createClientConfig = require('./createClientConfig');
const createServerConfig = require('./createServerConfig');
const createConfig = require('./createConfig');
const getIn = require('./getIn');
const paths = require('./paths');

// Enable to support custom options per script
// /**
//  * Validates a field in the scripts section of the razzle config which contains the config keys.
//  * @param {Object} razzleCfg Razzle config
//  * @param {Array<string>} objPath Path to field
//  * @param {boolean} req Is field required
//  */
// const validateField = (razzleCfg, objPath = [], req) => {
//   const configKeys = getIn(razzleCfg, objPath);
//   if (!req && configKeys === undefined) return;
//   if (!Array.isArray(configKeys)) {
//     throw new TypeError(`Expected an \`Array\`, got \`${typeof configKeys}\``);
//   }

//   if (req && configKeys.length === 0) {
//     throw Error('Expected `use` to contain config names');
//   }

//   configKeys.forEach((configKey) => {
//     if (getIn(razzleCfg, ['configs', configKey]) === undefined) {
//       throw Error(`Invalid config name \`${configKey}\` found in \`${objPath.join('.')}\``);
//     }
//   });
// };

// const validate = (razzleCfg) => {
//   const scripts = Object.keys(getIn(razzleCfg, ['scripts']));
//   // only validate the required script configs
//   const requiredScripts = ['start', 'build'];
//   requiredScripts.forEach((reqScript) => {
//     if (!scripts.includes(reqScript)) {
//       throw Error(`Expected \`${reqScript}\` in \`scripts\`, but none found.`);
//     }
//     validateField(razzleCfg, ['scripts', reqScript, 'build'], true);
//     validateField(razzleCfg, ['scripts', reqScript, 'optional'], false);
//   });
// };

let _razzleCfg = {};

const validateFnField = (razzleCfg, objPath = []) => {
  const value = getIn(razzleCfg, objPath);
  if (typeof value !== 'function') {
    throw new TypeError(`Expected an \`Function\`, got \`${typeof value}\` at ${objPath.join('.')}`);
  }
};

const validate = (razzleCfg) => {
  const configs = Object.keys(getIn(razzleCfg, ['configs']));
  // only validate the required script configs
  const requiredConfigs = ['client', 'server'];
  requiredConfigs.forEach((reqConfig) => {
    if (!configs.includes(reqConfig)) {
      throw Error(`Expected required \`${reqConfig}\` in \`configs\`, but none found.`);
    }
    validateFnField(razzleCfg, ['configs', reqConfig]);
  });
};

const read = () => {
  try {
    // Using require() here into order to load the file dynamically and cache it bc that's what require does
    // eslint-disable-next-line import/no-dynamic-require, global-require
    _razzleCfg = require(paths.appRazzleConfig);
    validate(_razzleCfg);
  } catch (e) {
    clearConsole();
    logger.error('Invalid razzle.config.js file.', e);

    process.exit(1);
  }
  return _razzleCfg;
};

const get = (arrPath) => {
  if (isEmpty(_razzleCfg)) read();
  const p = Array.isArray(arrPath) ? arrPath : [arrPath];
  return getIn(_razzleCfg, p);
};

const createConfigParams = (configName, dotenv, options = {}) => ({
  createWebpackConfig: (appConfig) => {
    const initConfig = createConfig(dotenv, appConfig);
    return configName === 'server'
      ? createServerConfig(dotenv, paths, initConfig, options)
      : createClientConfig(dotenv, paths, initConfig, options);
  },
  paths,
  env: dotenv.raw,
});

const runConfigFn = (configName, dotenv, options = {}) => {
  const _createConfig = get(['configs', configName]);
  if (_createConfig) {
    const params = createConfigParams(configName, dotenv, options);
    const webpackConfig = _createConfig(params);
    // fs.writeJsonSync(
    //   path.resolve(__dirname, `webpack-generated__${configName}__${Date.now()}.json`),
    //   webpackConfig,
    // );
    return Array.isArray(webpackConfig) ? webpackConfig : [webpackConfig];
  }
  return [];
};

const buildConfigs = (configKeys = [], dotenv, options = {}) => {
  return configKeys.reduce((acc, cur) => {
    const config = runConfigFn(cur, dotenv, options);
    return [...acc, ...config];
  }, []);
};

/**
 * Build the given configs.
 * @param {Array<string>} configKeys Configs to build
 * @param {Object} dotenv Environment variables
 */
const run = (configKeys = [], dotenv, options = {}) => {
  return buildConfigs(configKeys, dotenv, options).flat(); // flatten by 1 in case of multiple webpack configs per config generator
};

module.exports = {
  run,
  get,
  read,
};
