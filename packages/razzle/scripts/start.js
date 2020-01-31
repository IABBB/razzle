#! /usr/bin/env node

process.env.NODE_ENV = 'development';
// const path = require('path');
// const fs = require('fs-extra');
const chalk = require('chalk');
const DevServer = require('webpack-dev-server');
const rimrafAsync = require('@iabbb/razzle-dev-utils/rimrafAsync');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('@iabbb/razzle-dev-utils/logger');
// const setPorts = require('@iabbb/razzle-dev-utils/setPorts');
const dotenv = require('../config/env').getClientEnv();
const paths = require('../config/paths');
const razzleConfig = require('../config/razzleConfig');
const compiler = require('../config/webpack/compiler');

process.noDeprecation = true; // turns off that loadQuery clutter.

// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK = process.argv.find((arg) => arg.match(/--inspect-brk(=|$)/)) || '';
process.env.INSPECT = process.argv.find((arg) => arg.match(/--inspect(=|$)/)) || '';

// Indicates whether the
const IS_LOCAL = true;

const createDevServerOptions = ({ host, port, contentBase }) => {
  // Configure webpack-dev-server to serve our client-side bundle from
  // http://${dotenv.raw.HOST}:3001
  return {
    // stats: { all: false, errors: true, errorDetails: true, moduleTrace: true, warnings: true },
    // open: true,
    disableHostCheck: true,
    clientLogLevel: 'none',
    // Enable gzip compression of generated files.
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebookincubator/create-react-app/issues/387.
      disableDotRule: true,
    },
    host,
    hot: true,
    noInfo: true,
    overlay: false,
    port,
    quiet: true,
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
    contentBase,
    writeToDisk: true,
    // Make sure loadable.json files are written
    // writeToDisk(filePath) {
    //   return /loadable\.json$/.test(filePath);
    // },
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
  // const webDotEnv = getClientEnv('web');

  const runOptions = { isLocal: IS_LOCAL };

  // Create the client configs
  const clientConfigs = razzleConfig.run(['client'], dotenv, runOptions);

  const optionalConfigs = razzleConfig.run(
    Object.keys(razzleConfig.get(['configs'])).filter((x) => process.argv.includes(`--${x}`)),
    dotenv,
    runOptions,
  );

  console.log('Client configs compiled');
  // Delete build folder
  await rimrafAsync(paths.appBuild);
  console.log('Cleared app build directory');

  // Instantiate the webpack compiler with the config
  const clientMultiCompiler = compiler.create(clientConfigs);

  console.log('Instantiated client compiler');

  if (optionalConfigs.length > 0) {
    const opMultiCompiler = compiler.create(optionalConfigs);
    opMultiCompiler.run((err) => {
      if (err) {
        throw Error(err);
      }
    });
  }

  const serverConfig = razzleConfig.run(['server'], dotenv, runOptions);
  const serverCompiler = compiler.create(serverConfig);

  console.log('Instantiated server compiler');

  // fs.writeJsonSync(
  //   path.resolve(__dirname, `all-webpack-configs-generated__${Date.now()}.json`),
  //   clientConfigs.concat(serverConfig),
  // );

  // Instatiate a variable to track server watching
  let watching;

  // console.log('server compiled');
  // Start our server webpack instance in watch mode after assets compile
  clientMultiCompiler.hooks.done.tap('Clients Assets Compiled', () => {
    if (watching) {
      console.log('watching server');
      return;
    }
    // Otherwise, create a new watcher for our server code.
    watching = serverCompiler.watch(
      {
        quiet: true,
        stats: 'none',
      },
      /* eslint-disable no-unused-vars */
      (stats) => {
        // console.log('watching');
      },
    );
  });

  const publicPathUrl = new URL(dotenv.raw.SERVER_PUBLIC_PATH);

  // Create a new instance of Webpack-dev-server for our client assets.
  // This will actually run on a different port than the users app.
  // Make sure to pass in dev-server options here, as the second argument otherwise it will be ignored
  const clientDevServer = new DevServer(
    clientMultiCompiler,
    createDevServerOptions({
      host: publicPathUrl.hostname,
      port: publicPathUrl.port,
      contentBase: dotenv.raw.PUBLIC_DIR,
    }),
  );

  // Start Webpack-dev-server
  // eslint-disable-next-line radix
  clientDevServer.listen(publicPathUrl.port, (err) => {
    if (err) {
      logger.error(err);
    }
  });
}

main().catch(console.error);
