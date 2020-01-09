// const merge = require('deepmerge');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
// const AssetsPlugin = require('assets-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const WebpackBar = require('webpackbar');
const modifyEntry = require('./webpack/modifyEntry');
// const paths = require('./paths');
// const resolve = require('./webpack/resolve');

// Extrac the entry from the cfgBase to overwrite it
module.exports = (isLocalDev, dotenv, paths, cfgBase) => {
  const IS_LOCAL_DEVELOPMENT = isLocalDev;
  const IS_DEV = dotenv.raw.NODE_ENV === 'development';
  const _config = {};

  _config.plugins = [
    // Output our JS and CSS files in a manifest file called assets.json
    // in the build directory.
    // new AssetsPlugin({
    //   path: dotenv.raw.PUBLIC_DIR,
    //   filename: `${cfgBase.name}.assets.json`,
    //   prettyPrint: true,
    //   entrypoints: true,
    // }),
    new LoadablePlugin({
      filename: `${cfgBase.name}.loadable.json`,
    }),
  ];

  _config.module = {
    rules: [
      // Rules for images
      {
        test: /\.(bmp|gif|jpe?g|png|svg)$/,
        oneOf: [
          {
            issuer: /\.m?js?$/,
            test: /\.svg/,
            resourceQuery: /icon/,
            loader: require.resolve('@iabbb/svg-icon-loader'),
          },
          {
            loader: require.resolve('file-loader'),
            options: {
              name: IS_DEV ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]',
              emitFile: true,
            },
          },
        ],
      },
    ],
  };

  _config.optimization = {
    namedModules: IS_DEV, // NamedModulesPlugin()
    splitChunks: { name: IS_DEV },
    runtimeChunk: 'single',
    noEmitOnErrors: false, // NoEmitOnErrorsPlugin
    concatenateModules: true, // ModuleConcatenationPlugin
    minimize: !IS_DEV,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        sourceMap: false, // turned off to decrease build time
        terserOptions: { compress: { warnings: true } },
      }),
    ],
  };

  _config.output = {
    path: paths.appBuildPublicClient,
    publicPath: dotenv.raw.CLIENT_PUBLIC_PATH,
  };

  if (IS_DEV) {
    // Setup Webpack Dev Server on port 3001 and
    // specify our client entry point /client/index.js
    // config.entry = [require.resolve('@iabbb/razzle-dev-utils/webpackHotDevClient'), appSrcIndexJsPath];

    if (IS_LOCAL_DEVELOPMENT) {
      _config.plugins.push(
        new webpack.HotModuleReplacementPlugin({
          multiStep: true,
        }),
        new WebpackBar({
          color: '#f56be2',
          name: cfgBase.name,
        }),
      );

      // Add HotDevClient to entry.  Must handle a variety of supported syntaxes, bc why not.
      _config.entry = modifyEntry(cfgBase.entry, (chunkEntry) =>
        chunkEntry.unshift(require.resolve('@iabbb/razzle-dev-utils/webpackHotDevClient')),
      );

      // Then clear out cfgBase.entry so it isn't merged. Bit of a hack
      // eslint-disable-next-line no-param-reassign
      cfgBase.entry = {};
    }

    // Configure our client bundles output. Note the public path is set to 3001.
    _config.output = {
      ..._config.output,
      // the number after the hash, ex [hash:8] or [chunkhash:8], indicates the length of the hash.  default is 20.
      filename: `js/${cfgBase.name}/[name].js`,
      pathinfo: true,
      chunkFilename: `js/${cfgBase.name}/[name].js`,
      devtoolModuleFilenameTemplate: (info) => path.resolve(info.resourcePath).replace(/\\/g, '/'),
    };

    // Add client-only development plugins
    _config.plugins.push(new webpack.DefinePlugin(dotenv.stringified));
  } else {
    _config.output = {
      ..._config.output,
      filename: `js/${cfgBase.name}/[name].[chunkhash:8].js`,
      chunkFilename: `js/${cfgBase.name}/[name].[chunkhash:8].chunk.js`,
    };

    _config.plugins.push(
      // Define production environment vars
      new webpack.DefinePlugin(dotenv.stringified),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
    );
  }

  return merge(cfgBase, _config);
};
