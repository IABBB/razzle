/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(_path, needsSlash) {
  const hasSlash = _path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return _path.substr(_path, _path.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${_path}/`;
  }
  return _path;
}

const getPublicUrl = (appPackageJson) => envPublicUrl || require(appPackageJson).homepage;

function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const getVersion = (packageJson) => require(packageJson).version;

const resolveOwn = (relativePath) => path.resolve(__dirname, '..', relativePath);

// NODE_PATH is not supported since
// const nodePaths = (process.env.NODE_PATH || '')
//   .split(process.platform === 'win32' ? ';' : ':')
//   .filter(Boolean)
//   .filter((folder) => !path.isAbsolute(folder))
//   .map(resolveApp);

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appBuildPublic: resolveApp('build/public'),
  appBuildPublicAssets: resolveApp('build/public/dist'),
  // appManifest: resolveApp('build/assets.json'), // needs to support dynamic, multi-app
  appPublic: resolveApp('public'),
  appNodeModules: resolveApp('node_modules'),
  appSrc: resolveApp('src'),
  appPackageJson: resolveApp('package.json'),
  // appServerIndexJs: resolveApp('src'),
  // appClientIndexJs: resolveApp('src/client'), needs to be dynamic since supporting multi apps
  tsTestsSetup: resolveApp('src/setupTests.ts'),
  jsTestsSetup: resolveApp('src/setupTests.js'),
  appBabelRc: resolveApp('.babelrc'),
  appRazzleConfig: resolveApp('razzle.config.js'),
  // nodePaths,
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'),
  ownVersion: getVersion(resolveOwn('package.json')),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};
