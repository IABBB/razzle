const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const pickByLocale = require('@iabbb/utils/locale/pickByLocale');
const schema = require('./options.json');

module.exports = function i18n(source) {
  const options = loaderUtils.getOptions(this);
  // validate loader
  validateOptions(schema, options, { name: 'i18n-loader' });
  const callback = this.async();

  try {
    // Create new object from `i18n.json` using the given `currentLocale`
    const value = JSON.stringify(pickByLocale(JSON.parse(source), options.currentLocale, options.defaultLocale));
    // Generate CJS syntax
    const result = `module.exports = ${value}`;
    // Complete loader
    return callback(null, result); // `return` statement not required. Only to statisfy Eslint.
  } catch (err) {
    return callback(err);
  }
};
