import {
  execSync,
} from 'child_process';

const ColorizeText = requireF('services/ColorizeText');

/**
 * The main class that handles the 'status' command execution.
 *
 * @export
 * @class StatusCommand
 * @property {string} MK_INTRO The translation key of 'initializing' phase message
 */
export default class StatusCommand {
  MK_INTRO = 'mastery.status.intro';

  /**
   * The main method that calls 'pm2 monit' with inherited stdio and then show all pm2 processes and live monitoring them.
   */
  execute() {
    console.log(ColorizeText.info(i18n.t(this.MK_INTRO)));
    console.log('');

    execSync(`${constants.PM2_BIN} monit`, {
      stdio: 'inherit',
    });
  }
}
