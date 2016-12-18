import _ from 'lodash';
import fs from 'fs';
import glob from 'glob';
import path from 'path';

/**
 * Provides static methods of common services
 *
 * @export
 * @class CommonServices
 */
export default class CommonServices {
  /**
   * Require a file relatives to project parent path (src/build)
   *
   * @example
   * // Returns a package.json file content
   * requireF('../package.json');
   *
   * @param  {string} file Relative path from rootPath (src/build)
   * @returns {any} file content
   */
  static requireF = (file: string) => require(path.join(rootPath, file));

  /**
   * Allow to use glob.sync with multiple patterns
   *
   * @example
   * // Returns '${workspaceRoot}/package.json'
   * globSyncMultiple(path.resolve(path.join(rootPath, '../*package.json')));
   *
   * @param  {string|string[]} patterns Glob patterns
   * @returns {string[]} file paths
   */
  static globSyncMultiple = (patterns: string|string[]) => {
    let results = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const pattern of _.castArray(patterns)) {
      const files = glob.sync(pattern);
      results = _.concat(results, files);
    }
    return results;
  }

  /**
   * Requiring multiple files at once, populate each result to an object identified by index number
   *
   * @example
   * // Returns a package.json file content
   * requireAll(path.resolve(path.join(rootPath, '../package.json)));
   *
   * @param  {string|string[]} pattern Glob patterns
   * @returns {any[]} file contents
   */
  static requireAll = (pattern: string|string[]) => {
    const results = {};
    const patternCollection = _.castArray(pattern);
    const patternFiles = CommonServices.globSyncMultiple(patternCollection);
    _.forEach(patternFiles, (patternFilePath, idx) => {
      const result = require(patternFilePath);
      if (result) {
        _.set(results, idx, result);
      }
    });
    return results;
  }

  /**
   * Return a package.json file content
   *
   * @example
   * // Returns a package.json file content from 'build' directory
   * process.chdir('build');
   * getTargetPackage();
   *
   * @param  {string='.'} targetDir Relative path of target directory to retrieve its package.json
   * @returns {Object|Boolean} Requiring result
   */
  static getTargetPackage = (targetDir: string = '.') => {
    const resolvedTargetDir = path.resolve(targetDir);
    let packagePath;
    if (fs.existsSync(path.join(resolvedTargetDir, 'package.json'))) {
      packagePath = path.join(resolvedTargetDir, 'package.json');
    } else if (fs.existsSync(path.join(resolvedTargetDir, '../package.json'))) {
      packagePath = path.join(resolvedTargetDir, '../package.json');
    }
    if (packagePath) {
      return require(packagePath);
    }
    return false;
  }

  /**
   * Return a mastery.run.json file content
   *
   * @example
   * // Returns a mastery.run.json file content from 'build' directory if exists
   * process.chdir('build');
   * getTargetRunConf();
   *
   * @param  {string='.'} targetDir Relative path of target directory to retrieve its mastery.run.json
   * @returns {Object|Boolean} Requiring result
   */
  static getTargetRunConf = (targetDir: string = '.') => {
    const resolvedTargetDir = path.resolve(targetDir);
    const runConfPath = path.join(resolvedTargetDir, constants.RUN_FILE);
    if (fs.existsSync(runConfPath)) {
      return require(runConfPath);
    }
    return false;
  }

  /**
   * Get the name based on nameOverride/mastery.run.json/package.json/default server name
   *
   * @example
   * // Returns a project name from mastery.run.json:name inside build directory
   * process.chdir('build');
   * getServerName();
   *
   * @param  {string='.'} targetDir
   * @param  {string|undefined} nameOverride
   * @returns {string} Project name
   */
  static getServerName = (targetDir: string = '.', nameOverride: string|undefined) => {
    const resolvedTargetDir = path.resolve(targetDir);

    let packageName;
    const targetRunConf = CommonServices.getTargetRunConf(resolvedTargetDir);
    const targetPackage = CommonServices.getTargetPackage(resolvedTargetDir);
    if (targetRunConf) {
      packageName = targetRunConf.apps.name;
    } else if (targetPackage) {
      packageName = targetPackage.name;
    }

    return nameOverride ||
      _.get(targetRunConf, 'name') ||
      packageName ||
      constants.DEFAULT_SERVER_NAME;
  }

  /**
   * Transform a commander option value to another CLI parameter
   *
   * @example
   * // Returns '--debug-brk 5858'
   * transformOption(5858, '--debug-brk');
   *
   * @param  {any} optionValue
   * @param  {string} transformTo
   * @returns {string} Transformed option, empty if optionValue is undefined
   */
  static transformOption = (optionValue: any, transformTo:string) => {
    if (!_.isUndefined(optionValue)) {
      return `${transformTo} ${optionValue}`;
    } else if (_.isBoolean(optionValue)) {
      return transformTo;
    }
    return '';
  }
}
