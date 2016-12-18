import {
  execSync,
} from 'child_process';

export default class StartCommand {
  execute = () => {
    execSync(`${constants.PM2_BIN} monit`, {
      stdio: 'inherit',
    });
  }
}
