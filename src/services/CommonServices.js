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
   * requireF('../package.json');
   *
   * // returns package.json file content
   *
   * @function
   * @name CommonServices.requireF
   * @param  {string} file Relative path from rootPath (src/build)
   * @returns {any} file content
   */
  static requireF(file: string) {
    return require(path.join(rootPath, file));
  }

  /**
   * Allow to use glob.sync with multiple patterns
   *
   * @example
   * globSyncMultiple(path.resolve(path.join(rootPath, '../*package.json')));
   *
   * // returns ['root/package.json']
   *
   * @function
   * @name CommonServices.globSyncMultiple
   * @param  {string|string[]} patterns Glob patterns
   * @returns {string[]} file paths
   */
  static globSyncMultiple(patterns: string|string[]) {
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
   * requireAll(path.resolve(path.join(rootPath, '../package.json')));
   *
   * // returns package.json file content
   *
   * @function
   * @name CommonServices.requireAll
   * @param  {string|string[]} pattern Glob patterns
   * @returns {any[]} file contents
   */
  static requireAll(pattern: string|string[]) {
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
   * process.chdir('build');
   * getTargetPackage();
   *
   * // returns package.json file content from 'build' directory
   *
   * @function
   * @name CommonServices.getTargetPackage
   * @param  {string} [targetDir=.] Relative path of target directory to retrieve its package.json
   * @returns {Object|Boolean} Requiring result
   */
  static getTargetPackage(targetDir: string = '.') {
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
   * process.chdir('build');
   * getTargetRunConf();
   *
   * // returns mastery.run.json file content from 'build' directory if exists
   *
   * @function
   * @name CommonServices.getTargetRunConf
   * @param  {string} [targetDir=.] Relative path of target directory to retrieve its mastery.run.json
   * @returns {Object|Boolean} Requiring result
   */
  static getTargetRunConf(targetDir: string = '.') {
    const resolvedTargetDir = path.resolve(targetDir);
    const runConfPath = path.join(resolvedTargetDir, constants.RUN_FILE);
    if (fs.existsSync(runConfPath)) {
      return require(runConfPath);
    }
    return false;
  }

  /**
   * Return a mastery.run.json file content
   *
   * @example
   * getTargetBabelRecipe();
   *
   * // returns .babelrc file content from 'root' directory if exists
   *
   * @function
   * @name CommonServices.getTargetBabelRecipe
   * @param  {string} [targetDir=.] Relative path of target directory to retrieve its mastery.run.json
   * @returns {Object|Boolean} .babelrc file content or false
   */
  static getTargetBabelRecipe(targetDir: string = '.') {
    const resolvedTargetDir = path.resolve(targetDir);
    const recipePath = path.join(resolvedTargetDir, '.babelrc');
    if (fs.existsSync(recipePath)) {
      let recipe = {};
      try {
        const recipeContent = fs.readFileSync(recipePath);
        recipe = JSON.parse(recipeContent.toString('utf8'));
      } catch (e) {
        //
      }
      return recipe;
    }
    return false;
  }

  /**
   * Get the name based on nameOverride/mastery.run.json/package.json/default server name
   *
   * @example
   * process.chdir('build');
   * getServerName();
   *
   * // returns a project name from mastery.run.json:name inside build directory
   *
   * @function
   * @name CommonServices.getServerName
   * @param  {string} [targetDir=.]
   * @param  {string} [nameOverride]
   * @returns {string} Project name
   */
  static getServerName(targetDir: string = '.', nameOverride: string) {
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
   * transformOption(5858, '--debug-brk');
   *
   * // returns '--debug-brk 5858'
   *
   * @function
   * @name CommonServices.transformOption
   * @param  {any} optionValue
   * @param  {string} transformTo
   * @returns {string} Transformed option, empty if optionValue is undefined
   */
  static transformOption(optionValue: any, transformTo:string) {
    if (!_.isUndefined(optionValue)) {
      return `${transformTo} ${optionValue}`;
    } else if (_.isBoolean(optionValue)) {
      return transformTo;
    }
    return '';
  }
}
