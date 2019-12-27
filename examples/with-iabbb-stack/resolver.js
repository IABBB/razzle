const path = require('path');

module.exports = {
  node: {
    paths: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  webpack: {
    config: {
      resolve: {
        // TODO Create alias for images
        // alias: { TerminusContent: path.resolve('Terminus/TerminusContent/') },
        // Allow absolute paths in imports, e.g. import Button from 'components/General/Button'
        // Keep in sync with .eslintrc
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      },
    },
  },
};
