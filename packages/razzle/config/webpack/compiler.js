const webpack = require('webpack');
// const WebpackBar = require('webpackbar');
const printErrors = require('@iabbb/razzle-dev-utils/printErrors');
const getClientEnv = require('../env').getClientEnv;
const razzleConfig = require('../razzleConfig');

// const applyWebpackBarPlugin = (compiler, { name, color } = {}) =>
//   new WebpackBar({
//     color: color || '#f56be2',
//     name: name || compiler.name || 'client',
//   }).apply(compiler);

function create(config) {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (e) {
    printErrors('Failed to compile.', [e]);
    process.exit(1);
  }
  return compiler;
}

function runAsync(compiler) {
  return compiler.run((err, stats) => {
    if (err) return Promise.reject(err);
    return Promise.resolve(stats);
  });
}

// WIP - used to develop jest-worker
function runTestAsync(userArgs) {
  const webDotEnv = getClientEnv('web', {
    clearConsole: true,
    host: 'localhost',
    port: 3000,
  });
  console.log('Reading config');
  const allConfigs = razzleConfig.run('start', webDotEnv, userArgs);

  const webpackConfigs = allConfigs.filter((cfg) => cfg.name === 'polyfill');
  if (webpackConfigs.length !== 1) {
    printErrors('Polyfill not found!');
    process.exit(1);
  }
  const multiCompiler = create(webpackConfigs);
  // multiCompiler.compilers.forEach((comp) => applyWebpackBarPlugin(comp, { color: '#FFFF00' }));
  console.log('Compiler instantiated');
  return new Promise((resolve, reject) => {
    multiCompiler.run((err, stats) => {
      console.log('Compiled!');
      if (err) reject(err);
      resolve(stats.toJson());
    });
  });
}

module.exports = { runAsync, runTestAsync, create };
