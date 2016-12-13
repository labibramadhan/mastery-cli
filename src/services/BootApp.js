import _ from 'lodash';
import path from 'path';

const {
  requireAll,
} = require('../services/CommonServices');

export default class BootApp {
  boot = async () => {
    conf.use('memory');

    const mergedConfigs = {};
    const configs = requireAll(path.join(rootPath, 'config/**/*.json'));
    _.forEach(configs, (config) => {
      if (_.isObject(config)) _.merge(mergedConfigs, config);
    });

    conf.defaults(mergedConfigs);
  }
}
