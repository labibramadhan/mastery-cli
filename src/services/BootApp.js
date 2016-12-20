import _ from 'lodash';
import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';

const {
  requireAll,
} = requireF('services/CommonServices');

/**
 * Provides MasteryCLI full booting system
 *
 * @export
 * @class BootApp
 */
export default class BootApp {
  /**
   * Get all json files content under (src|build)/config directory and set them as nconf default configurations
   */
  bootConf() {
    const mergedConfigs = {};
    const configs = requireAll(path.join(rootPath, 'config/**/*.json'));
    _.forEach(configs, (config) => {
      if (_.isObject(config)) _.merge(mergedConfigs, config);
    });

    conf.defaults(mergedConfigs);
  }

  /**
   * Require all *.definition.js to let them define & handle available commands on this project
   */
  bootCommander() {
    requireAll(path.join(rootPath, 'packages/**/*.definition.js'));

    program.version(pkg.version).usage('[command] [options]');
    program.parse(process.argv);
  }

  /**
   * Show underscored MasteryJS ASCII text
   */
  welcome() {
    clear();
    console.log(chalk.cyan(figlet.textSync('MasteryJS')));
    console.log(chalk.cyan('---------------------------------------------------'));
    console.log('');
  }

  /**
   * MasteryCLI boot sequence
   */
  boot() {
    conf.use('memory');

    this.bootConf();

    this.welcome();

    this.bootCommander();
  }
}
