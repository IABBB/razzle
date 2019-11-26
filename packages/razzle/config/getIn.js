'use strict';

const getIn = (obj, path = [], defaultValue = undefined) => {
  if (!obj) {
    return defaultValue;
  }

  let output = obj;
  let i = -1;

  while (path.length > ++i) {
    if (output && path[i] in output) {
      output = output[path[i]];
    } else {
      return defaultValue;
    }
  }

  return output;
};

module.exports = getIn;
