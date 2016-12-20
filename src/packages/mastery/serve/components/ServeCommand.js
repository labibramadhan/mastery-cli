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

/**
 * The main class that handles the 'serve' command execution.
 *
 * @export
 * @class ServeCommand
 */
export default class ServeCommand {
  /**
   * The main method that exec babel-node command to run the MasteryJS directly from src directory.
   *
   * @param {Object} [options={}] The options come from Commander JS action argument
   */
  execute(options = {}) {
    validateRootDir();

    const basePath = path.resolve('.');
    const indexPath = path.join(basePath, 'src/index.js');

    execSync(`${constants.BABEL_NODE_BIN} ${indexPath} ${transformOption(options.port, '--debug-brk')} ${transformOption(options.inspect, '--inspect')}`, {
      stdio: 'inherit',
    });
  }
}
