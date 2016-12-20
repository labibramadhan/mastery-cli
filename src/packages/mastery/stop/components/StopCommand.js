import {
  Spinner,
} from 'cli-spinner';
import {
  execSync,
} from 'child_process';
import util from 'util';

const ColorizeText = requireF('services/ColorizeText');
const {
  getServerName,
} = requireF('services/CommonServices');
const {
  validateBuildDir,
} = requireF('services/CommonValidations');

/**
 * The main class that handles the 'stop' command execution.
 *
 * @export
 * @class StopCommand
 * @property {string} MK_STOPPING The translation key of 'stopping' phase message
 * @property {string} MK_STOPPED The translation key of 'stopped' phase message
 */
export default class StopCommand {
  MK_STOPPING = 'Stopping %s server..';
  MK_STOPPED = 'Stopped %s server';

  /**
   * The main method to exec 'pm2 stop {serverName}' command with inherited stdio, also output some text as decoration.
   *
   * @see CommonServices.getServerName
   */
  execute() {
    validateBuildDir();

    const serverName = getServerName();
    const loading = new Spinner(util.format(this.MK_STOPPING, serverName));
    loading.start();

    execSync(`pm2 stop ${serverName}`, {
      stdio: 'inherit',
    });

    loading.stop();
    console.log('');
    console.log(ColorizeText.info(util.format(this.MK_STOPPED, serverName)));
    console.log('');
  }
}
