/**
 * Applies the function passed to the webpack entry to modify the webpack entry
 * @param {string|object|array} webpackEntry Webpack's `entry` field.
 * @param {Function<string|object|array>} modifyFn Update the entry field using the fn
 */
const modifyEntry = (webpackEntry, modifyFn) => {
  if (typeof webpackEntry === 'object') {
    return Object.keys(webpackEntry).reduce((acc, cur) => {
      const chunkEntry = Array.isArray(webpackEntry[cur]) ? webpackEntry[cur] : [webpackEntry[cur]];
      modifyFn(chunkEntry);
      return { ...acc, [cur]: chunkEntry };
    }, {});
  }
  const chunkEntry = Array.isArray(webpackEntry) ? webpackEntry : [webpackEntry];
  modifyFn(chunkEntry);
  return chunkEntry;
};

module.exports = modifyEntry;
