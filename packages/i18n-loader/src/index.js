const path = require('path');
const fs = require('fs-extra');
const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const pickByLocale = require('@iabbb/utils/locale/pickByLocale');
const schema = require('./options.json');

module.exports = function i18n() {
  const options = loaderUtils.getOptions(this);
  // validate loader
  validateOptions(schema, options, { name: 'i18n-loader' });
  const callback = this.async();

  // Get i18n.json resource
  const p = path.join(path.dirname(this.resourcePath), 'i18n.json');

  // Read `i18n.json`
  fs.readJSON(p, (err, obj) => {
    if (err) return callback(err);
    try {
      // Create new object from `i18n.json` using the given `currentLocale`
      const value = JSON.stringify(pickByLocale(obj, options.currentLocale, options.defaultLocale));
      // Generate CJS syntax
      const result = `module.exports = ${value}`;
      // Add a file as dependency of the loader result in order to make them watchable
      this.addDependency(p);
      // Complete loader
      return callback(null, result); // `return` statement not required. Only to statisfy Eslint.
    } catch (err2) {
      return callback(err2);
    }
  });
};
