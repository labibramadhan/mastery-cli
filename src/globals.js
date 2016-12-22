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

const I18nWrapper = requireF('services/I18nWrapper');
/**
 * An instance of I18nWrapper (extended Polyglot class)
 *
 * @global
 * @type {I18nWrapper}
 */
global.i18n = new I18nWrapper();

const ColorizeText = requireF('services/ColorizeText');
/**
 * Show a danger colorized text from ColorizeText.danger and then exit the process with a number code
 *
 * @function throwError
 * @see ColorizeText.danger
 */
global.throwError = (errString: string, code: number = 1) => {
  console.error(ColorizeText.danger(errString));
  console.log('');
  process.exit(code);
};

const constants = requireF('constants');
/**
 * Sets all constants exported variable from root/constants.js as global variable
 *
 * @global
 * @type {Object}
 */
global.constants = constants;
