#! /usr/bin/env node

process.env.NODE_ENV = 'development';
const Worker = require('jest-worker').default;
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const merge = require('deepmerge');
const DevServer = require('webpack-dev-server');
const printErrors = require('@iabbb/razzle-dev-utils/printErrors');
const rimrafAsync = require('@iabbb/razzle-dev-utils/rimrafAsync');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('@iabbb/razzle-dev-utils/logger');
const setPorts = require('@iabbb/razzle-dev-utils/setPorts');
const getClientEnv = require('../config/env').getClientEnv;
const createConfig = require('../config/createConfig');
const paths = require('../config/paths');
const razzleConfig = require('../config/razzleConfig');
const compiler = require('../config/compiler');

process.noDeprecation = true; // turns off that loadQuery clutter.

// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK = process.argv.find((arg) => arg.match(/--inspect-brk(=|$)/)) || '';
process.env.INSPECT = process.argv.find((arg) => arg.match(/--inspect(=|$)/)) || '';

const applyWebpackBarPlugin = (compiler, { name, color } = {}) =>
  new WebpackBar({
    color: color || '#f56be2',
    name: name || compiler.name || 'client',
    profile: true,
  }).apply(compiler);

const createDevServerOptions = (dotenv) => {
  // Configure webpack-dev-server to serve our client-side bundle from
  // http://${dotenv.raw.HOST}:3001
  return {
    stats: { all: false, errors: true, errorDetails: true, moduleTrace: true, warnings: true },
    // open: true,
    disableHostCheck: true,
    // clientLogLevel: 'none',
    // Enable gzip compression of generated files.
    compress: true,
    // watchContentBase: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true,
    },
    host: dotenv.raw.HOST,
    hot: true,
    // noInfo: true,
    overlay: false,
    port: dotenv.raw.DEV_SERVER_PORT,
    // quiet: true,
    // By default files from `contentBase` will not trigger a page reload.
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/,
    },
    before(app) {
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());
    },
    contentBase: dotenv.raw.PUBLIC_DIR,
    // Make sure loadable.json files are written
    writeToDisk(filePath) {
      return /loadable\.json$/.test(filePath);
    },
  };
};

async function main() {
  console.log(`✨  Razzle IABBB ${chalk.green(`v${paths.ownVersion}`)} ✨ \n`);
  // Optimistically, we make the console look exactly like the output of our
  // FriendlyErrorsPlugin during compilation, so the user has immediate feedback.
  clearConsole();
  logger.start('Compiling...');
  // fs.removeSync(paths.appManifest);

  // Get client env variables
  const webDotEnv = getClientEnv('web', {
    clearConsole: true,
    host: 'localhost',
    port: 3000,
  });

  // Create webpack configs for configs listed under 'use' and 'optional' fields
  const clientConfigs = razzleConfig.run(razzleConfig.get(['scripts', 'start', 'use']), webDotEnv);
  const optionalConfigs = razzleConfig.run(
    razzleConfig.get(['scripts', 'start', 'optional']).filter((x) => process.argv.includes(`--${x}`)),
    webDotEnv
  );

  // Delete assets.json and loadable.json to always have a manifest up to date
  await rimrafAsync(path.join(paths.appBuild, '**/*.?(assets|loadable).json'));

  // Instantiate the webpack compiler with the config
  const clientMultiCompiler = compiler.create(clientConfigs[0]);
  // clientMultiCompiler.compilers.forEach((compiler) => applyWebpackBarPlugin(compiler, { color: '#f56be2' }));

  if (optionalConfigs.length > 0) {
    const opMultiCompiler = compiler.create(optionalConfigs);
    opMultiCompiler.compilers.forEach((compiler) => applyWebpackBarPlugin(compiler, { color: '#ffff00' }));
    opMultiCompiler.run((err) => {
      if (err) {
        throw Error(err);
      }
    });
  }

  const serverConfig = createConfig(
    'node',
    getClientEnv('node', { clearConsole: true, host: 'localhost', port: 3000 }),
    {}
  );
  // const serverCompiler = compiler.create(serverConfig);
  // applyWebpackBarPlugin(serverCompiler, { name: 'server', color: '#c065f4' });

  // fs.writeJsonSync(require('path').resolve(__dirname, `all-webpack-configs-generated__${Date.now()}.json`), clientConfigs.concat(serverConfig));

  // Instatiate a variable to track server watching
  // let watching;

  // // Start our server webpack instance in watch mode after assets compile
  // clientMultiCompiler.hooks.done.tap('Clients Assets Compiled', () => {
  //   if (watching) {
  //     return;
  //   }
  //   // Otherwise, create a new watcher for our server code.
  //   watching = serverCompiler.watch(
  //     {
  //       quiet: true,
  //       stats: 'none',
  //     },
  //     /* eslint-disable no-unused-vars */
  //     (stats) => {},
  //   );
  // });

  // Create a new instance of Webpack-dev-server for our client assets.
  // This will actually run on a different port than the users app.
  // Make sure to pass in dev-server options here, as the second argument otherwise it will be ignored
  const clientDevServer = new DevServer(clientMultiCompiler, createDevServerOptions(webDotEnv));

  // Start Webpack-dev-server
  clientDevServer.listen((process.env.PORT && parseInt(process.env.PORT) + 1) || razzle.port || 3001, (err) => {
    if (err) {
      logger.error(err);
    }
  });
}

// Webpack compile in a try-catch

setPorts()
  .then(main)
  .catch(console.error);
