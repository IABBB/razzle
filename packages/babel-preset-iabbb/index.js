'use strict';
const DEV = 'development';
const TEST = 'test';
const PROD = 'production';
const env = process.env.BABEL_ENV || process.env.NODE_ENV;
if (env !== DEV && env !== TEST && env !== PROD) {
  throw new Error(
    'Using `babel-preset-iabbb` requires that you specify `NODE_ENV` or ' +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"test", and "production". Instead, received: ' +
      JSON.stringify(env) +
      '.'
  );
}

const config = {
  plugins: [
    '@quickbaseoss/babel-plugin-styled-components-css-namespace',
    // Works together with @loadable for better import handling
    'babel-plugin-smart-webpack-import',
    // supports @loadable components
    '@loadable/babel-plugin',
    '@babel/plugin-proposal-export-namespace-from',
    // Adds syntax support for import()
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    // Add support for async/await
    '@babel/plugin-transform-runtime',
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
          browsers: [
            '>1%',
            'last 3 versions',
            'iOS >= 10',
            'Firefox ESR',
            'ie >= 11',
          ],
        },
        debug: false,
      },
    ],
    [
      '@babel/preset-react',
      {
        development: env === DEV || env === TEST,
      },
    ],
  ],
};

if (env === DEV) {
  config.plugins.push([
    'babel-plugin-styled-components',
    { displayName: true },
  ]);
}
if (env === TEST) {
  config.plugins.push(
    'babel-plugin-styled-components',
    // used by Jest when testing Loadable components
    'dynamic-import-node'
  );
}

if (env === PROD) {
  config.plugins.push(
    'babel-plugin-styled-components',
    '@babel/plugin-transform-react-inline-elements',
    '@babel/plugin-transform-react-constant-elements',
    'transform-react-remove-prop-types'
  );
}

module.exports = () => config;
