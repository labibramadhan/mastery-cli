import _ from 'lodash';
import fs from 'fs';
import path from 'path';

/**
 * Provides common validations static methods
 *
 * @export
 * @class CommonValidations
 * @property {string} MK_BUILD_DIR_INVALID The translation key of message to show when current directory is not a MasteryJS build directory
 * @property {string} MK_ROOT_DIR_INVALID The translation key of message to show when current directory is not a MasteryJS root directory
 */
export default class CommonValidations {
  static MK_BUILD_DIR_INVALID = 'Current directory is not a MasteryJS build directory';
  static MK_ROOT_DIR_INVALID = 'Current directory is not a MasteryJS root project directory';

  /**
   * Throw an error if directory isn't a root directory, a directory that contains a package.json file & others (see files variables below)
   *
   * @example
   * // Returns a thrown error
   * process.chdir('build');
   * validateRootDir();
   *
   * @function
   * @name CommonValidations.validateRootDir
   * @param  {string} [basePath=.] The relative path to check
   */
  static validateRootDir(basePath:string = '.') {
    const resolvedBasePath = path.resolve(basePath);
    const files = [{
      path: 'src/core/services/CommonServices.js',
      type: 'file',
    }, {
      path: 'src/core/services/BootServer.js',
      type: 'file',
    }, {
      path: 'src/core/services/I18nWrapper.js',
      type: 'file',
    }, {
      path: 'package.json',
      type: 'file',
    }];

    _.forEach(files, (file) => {
      const method = `is${_.capitalize(file.type)}`;
      const filePath = path.join(resolvedBasePath, file.path);
      if (!fs.existsSync(filePath) || !fs.lstatSync(filePath)[method]()) {
        throwError(CommonValidations.MK_ROOT_DIR_INVALID);
      }
    });
  }

  /**
   * Throw an error if directory isn't a MasteryJS build directory, a directory that contains a mastery.run.json file
   *
   * @example
   * // Returns a thrown error
   * process.chdir('/Users/labibramadhan/Desktop');
   * validateBuildDir();
   *
   * @function
   * @name CommonValidations.validateBuildDir
   * @param  {string} [basePath=.] The relative path to check
   */
  static validateBuildDir(basePath:string = '.') {
    const resolvedBasePath = path.resolve(basePath);
    const runConfPath = path.join(resolvedBasePath, constants.RUN_FILE);
    if (!fs.existsSync(runConfPath) || !fs.lstatSync(runConfPath).isFile()) {
      throwError(CommonValidations.MK_BUILD_DIR_INVALID);
    }
  }
}
