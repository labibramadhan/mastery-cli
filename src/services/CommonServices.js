import _ from 'lodash';
import glob from 'glob';
import path from 'path';

export default class CommonServices {
  static requireF = (file: string) => require(path.join(rootPath, file));

  static globSyncMultiple = (patterns: Array) => {
    let results = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const pattern of _.castArray(patterns)) {
      const files = glob.sync(pattern);
      results = _.concat(results, files);
    }
    return results;
  }

  static requireAll = (pattern: string) => {
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
}
