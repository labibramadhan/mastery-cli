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

export default class StopCommand {
  MK_STOPPING = 'Stopping %s server..';
  MK_STOPPED = 'Stopped %s server';

  execute = () => {
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
