import {
  execSync,
} from 'child_process';

/**
 * The main class that handles the 'status' command execution.
 *
 * @export
 * @class StatusCommand
 */
export default class StatusCommand {

  /**
   * The main method that calls 'pm2 monit' with inherited stdio and then show all pm2 processes and monitoring them.
   */
  execute() {
    execSync(`${constants.PM2_BIN} monit`, {
      stdio: 'inherit',
    });
  }
}
