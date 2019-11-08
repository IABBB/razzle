'use strict';

const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

module.exports = function i18n(source) {
  const callback = this.async();
  const options = loaderUtils.getOptions(this);

  const newBasename = path
    .basename(this.resourcePath)
    .includes(options.defaultLocale)
    ? path
        .basename(this.resourcePath)
        .replace(options.defaultLocale, options.currentLocale)
    : options.currentLocale;

  const newPath = path.resolve(path.dirname(this.resourcePath), newBasename);

  fs.readFile(path.resolve(this.context, newPath), (err, data) => {
    if (err) {
      // Return original source if file doesn't exist
      if (err.code === 'ENOENT') return callback(null, source);

      // Otherwise throw error
      return callback(err);
    }

    let output;

    try {
      // use the default file as fallback values
      output = JSON.stringify(
        Object.assign(JSON.parse(source), JSON.parse(data))
      );
    } catch (e) {
      output = data;
    }

    // Introduce file to webpack in order to make them watchable
    this.addDependency(newPath);

    return callback(null, output);
  });
};
