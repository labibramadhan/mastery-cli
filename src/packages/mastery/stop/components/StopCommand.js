import {
  execSync,
} from 'child_process';

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
 * @property {string} MK_INTRO The translation key of 'initializing' phase message
 * @property {string} MK_STOP_SUCCESS The translation key of 'server stopped' phase message
 */
export default class StopCommand {
  MK_INTRO = 'mastery.stop.intro';
  MK_STOP_SUCCESS = 'mastery.stop.success';

  /**
   * The main method to exec 'pm2 stop {serverName}' command with inherited stdio, also output some text as decoration.
   *
   * @see CommonServices.getServerName
   */
  execute() {
    validateBuildDir();

    const serverName = getServerName();
    console.log(ColorizeText.info(i18n.t(this.MK_INTRO, {
      serverName,
    })));
    console.log('');

    execSync(`pm2 stop ${serverName}`, {
      stdio: 'inherit',
    });

    console.log('');
    console.log(ColorizeText.info(i18n.t(this.MK_STOP_SUCCESS, {
      serverName,
    })));
    console.log('');
  }
}
