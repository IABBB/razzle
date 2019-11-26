process.env.NODE_ENV = 'development';
process.noDeprecation = true; // turns off that loadQuery clutter.
// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK =
  process.argv.find(arg => arg.match(/--inspect-brk(=|$)/)) || '';
process.env.INSPECT =
  process.argv.find(arg => arg.match(/--inspect(=|$)/)) || '';

const webpack = require('webpack');

const WebpackBar = require('webpackbar');
const Worker = require('jest-worker').default;
const printErrors = require('@iabbb/razzle-dev-utils/printErrors');
const clearConsole = require('react-dev-utils/clearConsole');
const getClientEnv = require('../config/env').getClientEnv;
const razzleConfig = require('../config/razzleConfig');
// const compiler = require('./compiler');

const applyWebpackBarPlugin = (compiler, { name, color } = {}) =>
  new WebpackBar({
    color: color || '#f56be2',
    name: name || compiler.name || 'client',
  }).apply(compiler);

async function main() {
  clearConsole();

  // const webDotEnv = getClientEnv('web', { clearConsole: true, host: 'localhost', port: 3000 });
  // const webpackConfigs = razzleConfig.run('start', webDotEnv).filter(cfg => cfg.name === 'polyfill');

  // if (webpackConfigs.length !== 1) {
  //   printErrors('Polyfill not found!');
  //   process.exit(1);
  // }

  //   console.log('Sync')
  //   await compiler.compileAndRunAsync(webpackConfigs);

  //   console.log('Parallel');
  //   return;

  const userArgs = process.argv.slice(2);
  const compilerWorker = new Worker(require.resolve('../config/compiler.js'), {
    maxRetries: 1,
  });
  compilerWorker.getStdout().pipe(process.stdout);
  compilerWorker.getStderr().pipe(process.stderr);
  // try {
  const result = await compilerWorker.runTestAsync(userArgs);
  // console.log('RESULT')
  // console.log(result)
  compilerWorker.end();
  // } catch (e) {
  //   compilerWorker.end();
  // }
}

main();
