#! /usr/bin/env node

// Do this as the first thing so that any code reading it knows the right env.
// process.env.NODE_ENV = 'production';

// Ensure environment variables are read.
require('../config/env');

const logSymbols = require('log-symbols');
const fs = require('fs-extra');
const chalk = require('chalk');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const rimrafAsync = require('@iabbb/razzle-dev-utils/rimrafAsync');
const paths = require('../config/paths');
const razzleConfig = require('../config/razzleConfig');
const dotenv = require('../config/env').getClientEnv();
const compiler = require('../config/webpack/compiler');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Helper function to copy public directory to build/public
function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuildPublic, {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });
}

// TODO: Parallel builds using jest-worker

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

const printStat = (webpackStat) => {
  const size = webpackStat.assets.reduce((acc, cur) => acc + cur.size, 0);
  console.log(logSymbols.success, chalk.bold(`${webpackStat.name}:`));
  console.log(` Total Size: ${formatBytes(size)}`);
};

async function main() {
  console.log(chalk.bgGreen(chalk.black(' BUILD ')));
  // Delete build folder
  await rimrafAsync(paths.appBuild);

  // Merge with the public folder
  copyPublicFolder();

  process.noDeprecation = true; // turns off that loadQuery clutter.

  const allConfigKeys = Object.keys(razzleConfig.get(['configs']));
  const configs = razzleConfig.run(allConfigKeys, dotenv);

  const multiCompiler = compiler.create(configs);

  process.stdout.write(
    `\nBuilding ${chalk.yellow(`[${configs.length}]`)} in ${chalk.yellow(`'${process.env.NODE_ENV}'`)} mode...`,
  );

  multiCompiler.hooks.done.tap('done', function(stats) {
    const rawMessages = stats.toJson({}, true);
    const messages = formatWebpackMessages(rawMessages);
    const showWarnings = process.argv.includes('--verbose') && messages.warnings.length;

    if (!messages.errors.length) {
      process.stdout.write(`${chalk.green(`COMPLETE`)}\n\n`);

      console.log(chalk.underline('Result:'));
      rawMessages.children.forEach((app) => printStat(app));
      if (showWarnings) {
        console.log(`\n${chalk.underline.yellow('Warnings')}\n`);
        messages.warnings.forEach((w) => console.log(w));
      }
    } else {
      process.stdout.write(`${chalk.red(`FAILED`)}\n`);
      return Promise.reject(new Error(messages.errors.join('\n\n')));
    }

    return Promise.resolve();
  });

  multiCompiler.run((err) => {
    if (err) {
      throw Error(err);
    }
  });
}

return main();
