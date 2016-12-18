import chalk from 'chalk';
import nconf from 'nconf';
import path from 'path';

global.rootPath = __dirname;

const {
  requireF,
} = require('./services/CommonServices');

global.requireF = requireF;
global.pkg = require(path.join(rootPath, '../package.json'));
global.conf = nconf;
global.throwError = (errString: string, code: number = 1) => {
  console.error(chalk.red(errString));
  console.log('');
  process.exit(code);
};

const constants = requireF('./constants');
global.constants = constants;
