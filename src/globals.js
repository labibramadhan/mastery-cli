import nconf from 'nconf';
import path from 'path';

/**
 * The root path of MasteryCLI (src/build)
 *
 * @global
 * @type {string}
 */
global.rootPath = __dirname;

const {
  requireF,
} = require('./services/CommonServices');

/**
 * @function requireF
 * @see CommonServices.requireF
 */
global.requireF = requireF;

/**
 * Cache the MasteryCLI package.json file content as global variable
 *
 * @global
 * @type {Object}
 */
global.pkg = require(path.join(rootPath, '../package.json'));

/**
 * Bridge to nconf, conf === nconf
 *
 * @global
 */
global.conf = nconf;

/**
 * Show a danger colorized text from ColorizeText.danger and then exit the process with a number code
 *
 * @function throwError
 * @see ColorizeText.danger
 */
const ColorizeText = requireF('services/ColorizeText');
global.throwError = (errString: string, code: number = 1) => {
  console.error(ColorizeText.danger(errString));
  console.log('');
  process.exit(code);
};

/**
 * Sets all constants exported variable from root/constants.js as global variable
 *
 * @type {Object}
 */
const constants = requireF('constants');
global.constants = constants;
