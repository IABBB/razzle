'use strict';

const xml2js = require('xml2js');

const parser = new xml2js.Parser();

module.exports = function parseSvg(source, map, meta) {
  const callback = this.async();

  parser.parseString(source, (err, { svg }) => {
    if (err) {
      callback(err);
      return;
    }

    const [, , width, height] = svg.$.viewBox.split(' ');

    callback(
      null,
      `module.exports = ${JSON.stringify({
        icon: [width, height, [], '', svg.path[0].$.d],
      })};`,
      map,
      meta
    );
  });
};
