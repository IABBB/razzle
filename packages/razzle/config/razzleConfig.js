const paths = require('./paths');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('@iabbb/razzle-dev-utils/logger');
const fs = require('fs-extra');
const createConfig = require('./createConfig');
const getIn = require('./getIn');
const isEmpty = require('lodash/isEmpty');

let _razzle = {};

const read = () => {
  try {
    _razzle = require(paths.appRazzleConfig);
    validate();
  } catch (e) {
    clearConsole();
    logger.error('Invalid razzle.config.js file.', e);
    process.exit(1);
  }
  return _razzle;
};

/**
 * Generates the webpack config defined in razzle.config.js combined with createConfig.js
 * @param {Object} dotenv Friendly process.env
 * @returns {Function} Creates the webpack config
 */
const razzleConfigFactory = dotenv => {
  // Create parameters used by the config generators in razzle.config.js
  // Provide a bunch of options to the user to customize their webpack config creation
  const _createConfigParams = {
    createWebpackConfig: appConfig =>
      createConfig(appConfig.target, dotenv, appConfig),
    paths,
    dotenv,
  };

  return configName => {
    const _createConfig = get(['configs', configName]);
    if (_createConfig) {
      const webpackConfig = _createConfig(_createConfigParams);
      return Array.isArray(webpackConfig) ? webpackConfig : [webpackConfig];
    }
    return [];
  };
};

const validateScriptUseField = scriptName => {
  const configKeys = get(['scripts', scriptName, 'use']);
  if (!Array.isArray(configKeys)) {
    throw new TypeError(`Expected an \`Array\`, got \`${typeof configKeys}\``);
  }
  if (configKeys.length === 0) {
    throw Error('Expected `use` to contain config names');
  }
  configKeys.forEach(configKey => {
    if (get(['configs', configKey]) === undefined) {
      throw Error(
        `Invalid config name \`${configKey}\` found in \`scripts.${scriptName}.use\``
      );
    }
  });
};

const validateScriptOptionalField = scriptName => {
  const configKeys = get(['scripts', scriptName, 'optional']);
  if (configKeys === undefined) return;
  if (!Array.isArray(configKeys)) {
    throw new TypeError(`Expected an \`Array\`, got \`${typeof configKeys}\``);
  }
  configKeys.forEach(configKey => {
    if (get(['configs', configKey]) === undefined) {
      throw Error(
        `Invalid config name \`${configKey}\` found in \`scripts.${scriptName}.optional\``
      );
    }
  });
};

const validate = () => {
  const scripts = Object.keys(get('scripts'));
  // only validate the required script configs
  const requiredScripts = ['start', 'build'];
  requiredScripts.forEach(reqScript => {
    if (!scripts.includes(reqScript)) {
      throw Error(`Expected \`${reqScript}\` in \`scripts\`, but none found.`);
    }
    validateScriptUseField(reqScript);
    validateScriptOptionalField(reqScript);
  });
};

const run = (configKeys = [], dotenv) => {
  const createClientConfig = razzleConfigFactory(dotenv);

  return buildConfigs(configKeys, createClientConfig).flat(); // flatten by 1 in case of multiple webpack configs per config generator
};

const buildConfigs = (configKeys = [], createClientConfig) => {
  return configKeys.reduce((acc, cur) => {
    const config = createClientConfig(cur);
    return [...acc, ...config];
  }, []);
};

const get = arrPath => {
  if (isEmpty(_razzle)) read();
  const p = Array.isArray(arrPath) ? arrPath : [arrPath];
  return getIn(_razzle, p);
};

module.exports = {
  run,
  get,
  read,
};
