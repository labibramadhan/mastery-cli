import {
  execSync,
  spawn,
} from 'child_process';

import chalk from 'chalk';
import util from 'util';

const ColorizeText = requireF('services/ColorizeText');

const {
  validateBuildDir,
} = requireF('services/CommonValidations');

const {
  getServerName,
} = requireF('services/CommonServices');

export default class StartCommand {
  MK_STARTING = 'Starting up %s server..';
  MK_MONITORING_TIPS = 'Run mastery status command to open process monitor';

  execute() {
    validateBuildDir();

    const serverName = getServerName();

    console.log(ColorizeText.info(util.format(this.MK_STARTING, serverName)));
    console.log('');

    execSync(`${constants.PM2_BIN} start ${constants.RUN_FILE}`, {
      stdio: 'ignore',
    });

    const logsSpawn = spawn(constants.PM2_BIN, [
      'logs', serverName,
      '--lines', 0,
      '--raw',
    ], {
      stdio: 'pipe',
    });

    logsSpawn.stderr.on('data', (data) => {
      const dataStr = data.toString('utf8');
      console.error(dataStr);
    });

    logsSpawn.stdout.on('data', (data) => {
      const dataStr = data.toString('utf8');
      console.log(chalk.green(dataStr));
      if (/running at/.test(dataStr)) {
        logsSpawn.kill();

        console.log(ColorizeText.info(this.MK_MONITORING_TIPS));
        console.log('');
      }
    });
  }
}
