import _ from 'lodash';
import glob from 'glob';

export default class CommonServices {
  static globSyncMultiple = (patterns: Array) => {
    let results = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const pattern of _.castArray(patterns)) {
      const files = glob.sync(pattern);
      results = _.concat(results, files);
    }
    return results;
  }

  static requireAll = (pattern) => {
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
