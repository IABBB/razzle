const rimrafPromise = require('util').promisify(require('rimraf'));
const toGlobString = require('./toGlobString');
/**
 * Delete files and folders based on glob
 * @param {string|string[]} glob glob pattern
 * @returns {Promise<string>} Glob used
 */
const rimrafAsync = (glob) => {
  const strGlob = Array.isArray(glob) ? toGlobString(glob) : glob;
  return rimrafPromise(strGlob).then(() => strGlob);
};

module.exports = rimrafAsync;
