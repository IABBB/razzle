const merge = require('deepmerge');
const paths = require('./paths');

const createConfig = (dotenv, { name, resolve, target, ...cfgBase }) => {
  const IS_DEV = dotenv.raw.NODE_ENV === 'development';

  // Base webpack configuration
  const _resolve = merge(
    {
      modules: [paths.appSrc, paths.appNodeModules, 'node_modules'],
      alias: {
        // This is required so symlinks work during development.
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
      },
    },
    resolve
  );

  const _config = {
    name,
    // Set webpack mode:
    mode: IS_DEV ? 'development' : 'production',
    // Set webpack context to the current command's directory
    context: process.cwd(),
    // Specify target (either 'node' or 'web')
    target,
    // Controversially, decide on sourcemaps.
    devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
    // We need to tell webpack how to resolve both Razzle's node_modules and
    // the users', so we use resolve and resolveLoader.
    resolve: _resolve,
    resolveLoader: {
      // TODO Pass in app node modules path to support various project structure
      modules: [paths.appNodeModules, paths.ownNodeModules],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Transform ES6 with Babel
        {
          test: /\.m?js?$/,
          include: [paths.appSrc],
          exclude: /\\text\\index\.js$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: true,
                cacheDirectory: true,
                presets: [require.resolve('../.babelrc.js')],
              },
            },
          ],
        },
      ],
    },
  };

  // Creates the true base config
  return merge(_config, cfgBase);
};

module.exports = createConfig;
