import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';

const {
  requireAll,
} = require('./services/CommonServices');
const BootApp = require('./services/BootApp');

require('./globals');

const bootApp = new BootApp();
bootApp.boot();

requireAll(path.join(rootPath, 'packages/**/*.definition.js'));

clear();
console.log(chalk.cyan(figlet.textSync('MasteryJS')));

const pkg = require(path.join(rootPath, '../package.json'));
program.version(pkg.version).usage('[command] [options]');
program.parse(process.argv);
