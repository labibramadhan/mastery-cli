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
   *
   * @memberof BootApp
   */
  bootConf = () => {
    const mergedConfigs = {};
    const configs = requireAll(path.join(rootPath, 'config/**/*.json'));
    _.forEach(configs, (config) => {
      if (_.isObject(config)) _.merge(mergedConfigs, config);
    });

    conf.defaults(mergedConfigs);
  }

  /**
   * Require all *.definition.js to let them define & handle available commands on this project
   *
   * @memberof BootApp
   */
  bootCommander = () => {
    requireAll(path.join(rootPath, 'packages/**/*.definition.js'));

    program.version(pkg.version).usage('[command] [options]');
    program.parse(process.argv);
  }

  /**
   * Show MasteryJS ASCII text with underscore
   *
   * @memberof BootApp
   */
  bootCLI = () => {
    clear();
    console.log(chalk.cyan(figlet.textSync('MasteryJS')));
    console.log(chalk.cyan('---------------------------------------------------'));
    console.log('');
  }

  /**
   * MasteryCLI boot sequence
   *
   * @memberof BootApp
   */
  boot() {
    conf.use('memory');

    this.bootConf();

    this.bootCommander();

    this.bootCLI();
  }
}
