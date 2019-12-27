const resolver = require('../resolver');

const config = () => ({
  name: 'server',
  // entry: require.resolve('../src/server/index.js'),
  entry: {
    server: require.resolve('../src/server/index.js'),
    // server: require.resolve('../src/server.js'),
  },
  target: 'node',
  resolve: resolver.webpack.config.resolve,
});
module.exports = config;
