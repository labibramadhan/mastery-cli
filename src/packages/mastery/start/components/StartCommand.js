import {
  execSync,
  spawn,
} from 'child_process';

import chalk from 'chalk';

const ColorizeText = requireF('services/ColorizeText');

const {
  validateBuildDir,
} = requireF('services/CommonValidations');

const {
  getServerName,
} = requireF('services/CommonServices');

/**
 * The main class that handles the 'start' command execution.
 *
 * @export
 * @class StartCommand
 * @property {string} MK_INTRO The translation key of 'initializing' phase message
 * @property {string} MK_MONITORING_TIPS The tranlation key of 'tips after server started' phase message
 */
export default class StartCommand {
  MK_INTRO = 'mastery.start.intro';
  MK_MONITORING_TIPS = 'mastery.start.tips';

  /**
   * Run 'pm2 start' command that uses the MasteryJS run file (mastery.run.json).
   */
  startPM2() {
    execSync(`${constants.PM2_BIN} start ${constants.RUN_FILE}`, {
      stdio: 'ignore',
    });
  }

  /**
   * Run 'pm2 logs {serverName}' command but pipe the stdio, if error happened then throw the error, otherwise detect if MasteryJS has been started to release/kill the spawned child process.
   * @see CommonServices.getServerName
   */
  streamLogs() {
    const logsSpawn = spawn(constants.PM2_BIN, [
      'logs', this.serverName,
      '--lines', 0,
      '--raw',
    ], {
      stdio: 'pipe',
    });

    logsSpawn.stderr.on('data', (data) => {
      const dataStr = data.toString('utf8');
      throwError(dataStr);
    });

    logsSpawn.stdout.on('data', (data) => {
      const dataStr = data.toString('utf8');
      console.log(chalk.green(dataStr));
      if (/running at/.test(dataStr)) {
        logsSpawn.kill();

        console.log(ColorizeText.info(i18n.t(this.MK_MONITORING_TIPS)));
        console.log('');
      }
    });
  }

  /**
   * The main method to call another methods sequentially, including decorations output.
   */
  execute() {
    validateBuildDir();

    this.serverName = getServerName();

    this.startPM2();

    this.streamLogs();

    console.log(ColorizeText.info(i18n.t(this.MK_INTRO, {
      serverName: this.serverName,
    })));
    console.log('');
  }
}
