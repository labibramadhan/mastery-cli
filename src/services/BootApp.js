import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';

const {
  globSyncMultiple,
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
    conf.defaults(require(path.join(rootPath, 'config.json')));
  }

  /**
   * Populate all locale json files content and put them into global.i18n Polyglot instance
   */
  bootLocales() {
    const localeGlob = path.join(rootPath, 'locales/*.json');
    const localeFiles = globSyncMultiple(localeGlob);
    localeFiles.forEach((localePath) => {
      const locale = path.basename(localePath).replace('.json', '');
      i18n.extend({
        [locale]: require(localePath),
      });
    });
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

    this.bootLocales();

    this.welcome();

    this.bootCommander();
  }
}
