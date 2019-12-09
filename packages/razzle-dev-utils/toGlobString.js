/**
 * Converts a array of strings to a single, glob string.
 * @param {string[]} arr Array of strings
 * @returns {string} Glob
 */
const toGlobString = (arr) => {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an \`Array\`, got \`${typeof arr}\``);
  }
  return `{${arr.join()}}`;
};

module.exports = toGlobString;
