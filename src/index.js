import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';

require('./globals');

const {
  requireAll,
} = requireF('services/CommonServices');
const BootApp = requireF('services/BootApp');

const bootApp = new BootApp();
bootApp.boot();

requireAll(path.join(rootPath, 'packages/**/*.definition.js'));

clear();
console.log(chalk.cyan(figlet.textSync('MasteryJS')));

program.version(pkg.version).usage('[command] [options]');
program.parse(process.argv);
