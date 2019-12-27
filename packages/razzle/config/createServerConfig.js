/* eslint-disable no-param-reassign */
// const merge = require('deepmerge');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');
const WebpackBar = require('webpackbar');
const modifyEntry = require('./webpack/modifyEntry');
// const paths = require('./paths');

module.exports = (dotenv, paths, cfgBase) => {
  const IS_DEV = dotenv.raw.NODE_ENV === 'development';
  const _config = {};

  // We want to uphold node's __filename, and __dirname.
  _config.node = {
    __console: false,
    __dirname: false,
    __filename: false,
  };

  // We need to tell webpack what to bundle into our Node bundle.
  _config.externals = [
    nodeExternals({
      whitelist: [
        IS_DEV ? 'webpack/hot/poll?300' : null,
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/,
      ].filter((x) => x),
    }),
  ];

  // Specify webpack Node.js output path and filename
  _config.output = {
    path: paths.appBuild,
    publicPath: dotenv.raw.CLIENT_PUBLIC_PATH,
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  };
  // Add some plugins...
  _config.plugins = [
    // We define environment variables that can be accessed globally in our
    new webpack.DefinePlugin(dotenv.stringified),
    // Prevent creating multiple chunks for the server
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ];

  // defined in webpack config
  // config.entry = [paths.appServerIndexJs];

  if (IS_DEV) {
    // Use watch mode
    _config.watch = true;
    // config.entry.unshift('webpack/hot/poll?300');

    // // Pretty format server errors
    // config.entry.unshift('@iabbb/razzle-dev-utils/prettyNodeErrors');

    _config.entry = modifyEntry(cfgBase.entry, (chunkEntry) => {
      chunkEntry.unshift('webpack/hot/poll?300');
      // Pretty format server errors
      chunkEntry.unshift('@iabbb/razzle-dev-utils/prettyNodeErrors');
    });

    // Then clear out cfgBase.entry so it isn't merged. Bit of a hack.
    // eslint-disable-next-line no-param-reassign
    cfgBase.entry = {};

    const nodeArgs = ['-r', 'source-map-support/register'];

    // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
    if (process.env.INSPECT_BRK) {
      nodeArgs.push(process.env.INSPECT_BRK);
    } else if (process.env.INSPECT) {
      nodeArgs.push(process.env.INSPECT);
    }

    _config.plugins.push(
      // Add hot module replacement
      new webpack.HotModuleReplacementPlugin(),
      // Supress errors to console (we use our own logger)
      new StartServerPlugin({
        name: 'server.js',
        nodeArgs,
      }),
      // Ignore *.assets.json to avoid infinite recompile bug
      new webpack.WatchIgnorePlugin([/assets\.json|loadable\.json/g]),
      new WebpackBar({
        color: '#ffff00',
        name: cfgBase.name,
      })
      // new webpack.WatchIgnorePlugin(serverOptions.assetsJsonPaths)
      // new webpack.WatchIgnorePlugin(['C:/_forks/razzle/examples/with-iabbb-stack/build/site_en.assets.json'])
    );
  }

  return merge(cfgBase, _config);
};
