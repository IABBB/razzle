const resolver = require('./resolver');

module.exports = {
  parser: 'babel-eslint',
  extends: '@iabbb/eslint-config-iabbb',

  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/General/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    'import/resolver': resolver,
  },
};
