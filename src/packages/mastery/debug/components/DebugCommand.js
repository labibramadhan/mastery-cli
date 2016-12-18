import {
  execSync,
} from 'child_process';
import path from 'path';

const {
  transformOption,
} = requireF('services/CommonServices');
const {
  validateRootDir,
} = requireF('services/CommonValidations');

export default class DebugCommand {
  execute = (options = {}) => {
    validateRootDir();

    const basePath = path.resolve('.');
    const indexPath = path.join(basePath, 'src/index.js');

    execSync(`${constants.BABEL_NODE_BIN} ${indexPath} ${transformOption(options.port, '--debug-brk')} ${transformOption(options.inspect, '--inspect')}`, {
      stdio: 'inherit',
    });
  }
}
