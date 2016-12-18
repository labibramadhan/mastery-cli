import util from 'util';

const {
  getServerName,
} = requireF('services/CommonServices');
const {
  validateBuildDir,
} = requireF('services/CommonValidations');

const ColorizeText = requireF('services/ColorizeText');
const StopCommand = requireF('packages/mastery/stop/components/StopCommand');
const StartCommand = requireF('packages/mastery/start/components/StartCommand');

export default class ReloadCommand {
  MK_RELOADING = 'Reloading %s server..';

  execute = () => {
    validateBuildDir();

    const serverName = getServerName();

    console.log(ColorizeText.info(util.format(this.MK_RELOADING, serverName)));

    const stopCommand = new StopCommand();
    stopCommand.execute();

    const startCommand = new StartCommand();
    startCommand.execute();
  }
}
