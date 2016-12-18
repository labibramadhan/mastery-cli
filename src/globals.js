import nconf from 'nconf';
import path from 'path';

global.rootPath = __dirname;

const {
  requireF,
} = require('./services/CommonServices');

global.requireF = requireF;
global.pkg = require(path.join(rootPath, '../package.json'));
global.conf = nconf;

const constants = requireF('./constants');
global.constants = constants;
