require('babel-register');
require('babel-polyfill');

const Bluebird = require('bluebird');
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
const config = require('../common/config');
const rootDir = require('path').resolve(__dirname, '..', '..');
const webpackIsomorphicAssets = require('../../webpack/assets');

if (!process.env.NODE_ENV) {
  throw new Error(
    'Environment variable NODE_ENV must be set to development or production.'
  );
}

// http://bluebirdjs.com/docs/why-bluebird.html
global.Promise = Bluebird;

global.webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsomorphicAssets)
  .development(!config.isProduction)
  .server(rootDir, () => {
    require('./main');
  });
