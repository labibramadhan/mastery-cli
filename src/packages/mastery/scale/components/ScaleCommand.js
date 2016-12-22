import {
  execSync,
} from 'child_process';
import inquirer from 'inquirer';

const ColorizeText = requireF('services/ColorizeText');
const {
  getServerName,
} = requireF('services/CommonServices');
const {
  validateBuildDir,
} = requireF('services/CommonValidations');

/**
 * The main class that handles the 'scale' command execution.
 *
 * @export
 * @class ScaleCommand
 * @property {string} MK_INTRO The translation key of 'initializing' phase message.
 */
export default class ScaleCommand {
  MK_INTRO = 'scale.intro';


  /**
   * Retrieve cluster length if its not defined on the CLI arguments.
   *
   * @returns {Promise.<Object[]>} User answers, with question key as its key and answer as its value
   */
  async query() {
    const questions = [{
      name: 'length',
      message: i18n.t('mastery.questions.scale.length'),
      default: 0,
    }];

    return await inquirer.prompt(questions);
  }

  /**
   * The main method to call another methods sequentially, including decorations output. Then, exec 'pm2 scale' command.
   *
   * @param {string} [length] The cluster length to scale for
   * @returns {Promise}
   */
  async execute(length) {
    validateBuildDir();

    const serverName = getServerName();

    console.log(ColorizeText.info(i18n.t(this.MK_INTRO, {
      serverName,
    })));
    console.log('');

    let clusterLength;
    if (!length) {
      const answers = await this.query();
      clusterLength = answers.length;
    } else {
      clusterLength = length;
    }

    execSync(`${constants.PM2_BIN} scale ${serverName} ${clusterLength}`, {
      stdio: 'inherit',
    });
  }
}
