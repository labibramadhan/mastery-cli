const {
  getServerName,
} = requireF('services/CommonServices');
const {
  validateBuildDir,
} = requireF('services/CommonValidations');

const ColorizeText = requireF('services/ColorizeText');
const StopCommand = requireF('packages/mastery/stop/components/StopCommand');
const StartCommand = requireF('packages/mastery/start/components/StartCommand');

/**
 * The main class that handles the 'restart' command execution.
 *
 * @export
 * @class RestartCommand
 * @property {string} MK_INTRO The translation key of 'initializing' phase message
 */
export default class RestartCommand {
  MK_INTRO = 'mastery.restart.intro';

  /**
   * The main method to call 'stop' command and then call 'start' command by using their respective classes.
   */
  execute() {
    validateBuildDir();

    const serverName = getServerName();

    console.log(ColorizeText.info(i18n.t(this.MK_INTRO, {
      serverName,
    })));
    console.log('');

    const stopCommand = new StopCommand();
    stopCommand.execute();

    const startCommand = new StartCommand();
    startCommand.execute();
  }
}
