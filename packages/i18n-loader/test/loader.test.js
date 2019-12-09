const fs = require('fs-extra');
const compiler = require('./compiler');
const pickByLocale = require('@iabbb/utils/locale/pickByLocale');

describe('i18n-loader tests', () => {
  test('Consumes i18n.json and picks locale values', async () => {
    const stats = await compiler('./fixture/index.js', {
      defaultLocale: 'en',
      currentLocale: 'es',
    });

    // await fs.writeJson('stats.json', stats.toJson()); // Enable for debugging
    const output = stats.toJson().modules[0].source;
    const data = {
      title: 'Inicio',
      button: 'Click',
      language: 'ES',
    };
    expect(output).toBe(`module.exports = ${JSON.stringify(data)}`);
  }, 15000);
});
