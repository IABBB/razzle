'use strict';

const path = require('path');
const paths = require('../paths');
const nodePath = require('../env').nodePath;

// We need to tell webpack how to resolve both Razzle's node_modules and
// the users', so we use resolve and resolveLoader.
const resolve = {
  // Allow absolute paths in imports, e.g. import Button from 'components/General/Button'
  // Keep in sync with .eslintrc
  modules: ['node_modules', paths.appNodeModules, paths.appSrc].concat(
    // It is guaranteed to exist because we tweak it in `env.js`
    nodePath.split(path.delimiter).filter(Boolean)
  ),
  alias: {
    // This is required so symlinks work during development.
    'webpack/hot/poll': require.resolve('webpack/hot/poll'),
    // TerminusContent: path.resolve('Terminus/TerminusContent/'),
  },
};

module.exports = resolve;
