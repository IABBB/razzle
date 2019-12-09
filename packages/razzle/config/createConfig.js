const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const AssetsPlugin = require('assets-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const WebpackBar = require('webpackbar');
const paths = require('./paths');
const resolve = require('./webpack/resolve');

// This is the Webpack configuration factory. It's the juice!
module.exports = (
  target = 'web',
  dotenv,
  // webpack config - control what we can use for now
  {
    name,
    entry: appSrcIndexJsPath, // only support single entry in webpack config. renamed for clarity
    // module
  }
) => {
  // First we check to see if the user has a custom .babelrc file, otherwise
  // we just use babel-preset-iabbb.
  // const hasBabelRc = fs.existsSync(paths.appBabelRc);
  const babelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [require.resolve('../.babelrc.js')],
  };

  // Define some useful shorthands.
  const IS_NODE = target === 'node';
  const IS_WEB = target === 'web';
  const IS_DEV = dotenv.raw.NODE_ENV === 'development';

  // This is our base webpack config.
  const config = {
    // stats: {
    //   preset: 'verbose',
    //   colors: true,
    // },
    // stats: {
    //   colors: true,
    // },
    // profile: true,
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
    resolve,
    resolveLoader: {
      modules: [paths.appNodeModules, paths.ownNodeModules],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Transform ES6 with Babel
        {
          test: /\.m?js?$/,
          include: [paths.appSrc],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babelOptions,
            },
          ],
        },
      ],
    },
  };

  if (IS_NODE) {
    // We want to uphold node's __filename, and __dirname.
    config.node = {
      __console: false,
      __dirname: false,
      __filename: false,
    };

    // We need to tell webpack what to bundle into our Node bundle.
    config.externals = [
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
    config.output = {
      path: paths.appBuild,
      publicPath: dotenv.raw.CLIENT_PUBLIC_PATH,
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    };
    // Add some plugins...
    config.plugins = [
      // We define environment variables that can be accessed globally in our
      new webpack.DefinePlugin(dotenv.stringified),
      // Prevent creating multiple chunks for the server
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ];

    config.entry = [paths.appServerIndexJs];

    if (IS_DEV) {
      // Use watch mode
      config.watch = true;
      config.entry.unshift('webpack/hot/poll?300');

      // Pretty format server errors
      config.entry.unshift('@iabbb/razzle-dev-utils/prettyNodeErrors');

      const nodeArgs = ['-r', 'source-map-support/register'];

      // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
      if (process.env.INSPECT_BRK) {
        nodeArgs.push(process.env.INSPECT_BRK);
      } else if (process.env.INSPECT) {
        nodeArgs.push(process.env.INSPECT);
      }

      config.plugins = [
        ...config.plugins,
        // Add hot module replacement
        new webpack.HotModuleReplacementPlugin(),
        // Supress errors to console (we use our own logger)
        new StartServerPlugin({
          name: 'server.js',
          nodeArgs,
        }),
        // Ignore *.assets.json to avoid infinite recompile bug
        new webpack.WatchIgnorePlugin([/assets\.json|loadable\.json/g]),
        // new webpack.WatchIgnorePlugin(serverOptions.assetsJsonPaths)
        // new webpack.WatchIgnorePlugin(['C:/_forks/razzle/examples/with-iabbb-stack/build/site_en.assets.json'])
      ];
    }
  }

  if (IS_WEB) {
    // Name of the configuration. Used when loading multiple configurations.
    // (config.name = name),
    config.plugins = [
      new WebpackBar({
        color: '#f56be2',
        name,
        profile: true,
      }),
      // Output our JS and CSS files in a manifest file called assets.json
      // in the build directory.
      new AssetsPlugin({
        path: dotenv.raw.PUBLIC_DIR,
        // filename: 'assets.json'
        filename: `${name}.assets.json`,
        prettyPrint: true,
        entrypoints: true,
      }),
      new LoadablePlugin({
        filename: `${name}.loadable.json`,
        // writeToDisk: true,
      }),
    ];

    if (IS_DEV) {
      config.module.rules.push(
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
                emitFile: IS_WEB,
              },
            },
          ],
        }
      );

      // Setup Webpack Dev Server on port 3001 and
      // specify our client entry point /client/index.js
      // config.entry = [require.resolve('@iabbb/razzle-dev-utils/webpackHotDevClient'), appSrcIndexJsPath];
      config.entry = {
        [name]: [require.resolve('@iabbb/razzle-dev-utils/webpackHotDevClient'), appSrcIndexJsPath],
      };
      //   // client: [
      //   //   require.resolve('@iabbb/razzle-dev-utils/webpackHotDevClient'),
      //   //   paths.appClientIndexJs,
      //   // ],
      // };

      // Configure our client bundles output. Not the public path is to 3001.
      config.output = {
        path: paths.appBuildPublic,
        publicPath: dotenv.raw.CLIENT_PUBLIC_PATH,
        // the number after the hash, ex [hash:8] or [chunkhash:8], indicates the length of the hash.  default is 20.
        filename: '[name].js',
        pathinfo: true,
        chunkFilename: '[name].js',
        libraryTarget: 'var',
        devtoolModuleFilenameTemplate: (info) => path.resolve(info.resourcePath).replace(/\\/g, '/'),
      };

      // Add client-only development plugins
      config.plugins = [
        ...config.plugins,
        // new webpack.debug.ProfilingPlugin({
        //   outputPath: 'profiling/profileEvents.json',
        // }),
        new webpack.HotModuleReplacementPlugin({
          multiStep: true,
        }),
        new webpack.DefinePlugin(dotenv.stringified),
      ];

      config.optimization = {
        // @todo automatic vendor bundle
        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        // splitChunks: {
        //   chunks: 'all',
        // },
        // Keep the runtime chunk seperated to enable long term caching
        // https://twitter.com/wSokra/status/969679223278505985
        // runtimeChunk: true,
      };
    } else {
      // Specify production entry point (/client/index.js)
      config.entry = { [name]: appSrcIndexJsPath };
      // config.entry = appSrcIndexJsPath;
      // client: paths.appClientIndexJs,

      // Specify the client output directory and paths. Notice that we have
      // changed the publiPath to just '/' from http://localhost:3001. This is because
      // we will only be using one port in production.
      config.output = {
        path: paths.appBuildPublic,
        publicPath: dotenv.raw.PUBLIC_PATH,
        filename: 'static/js/bundle.[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        libraryTarget: 'var',
      };

      config.plugins = [
        ...config.plugins,
        // Define production environment vars
        new webpack.DefinePlugin(dotenv.stringified),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
      ];

      config.optimization = {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              parse: {
                // we want uglify-js to parse ecma 8 code. However, we don't want it
                // to apply any minfication steps that turns valid ecma 5 code
                // into invalid ecma 5 code. This is why the 'compress' and 'output'
                // sections only apply transformations that are ecma 5 safe
                // https://github.com/facebook/create-react-app/pull/4234
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebook/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
                // Disabled because of an issue with Terser breaking valid code:
                // https://github.com/facebook/create-react-app/issues/5250
                // Pending futher investigation:
                // https://github.com/terser-js/terser/issues/120
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebook/create-react-app/issues/2488
                ascii_only: true,
              },
            },
            // Use multi-process parallel running to improve the build speed
            // Default number of concurrent runs: os.cpus().length - 1
            parallel: true,
            // Enable file caching
            cache: true,
            // @todo add flag for sourcemaps
            sourceMap: true,
          }),
        ],
      };
    }
  }

  return config;
};
