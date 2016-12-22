import program from 'commander';

const RestartCommand = requireF('packages/mastery/restart/components/RestartCommand');

program
  .command('restart')
  .description('restart current MasteryJS server')
  .action(() => {
    const restartCommand = new RestartCommand();
    restartCommand.execute();
  });
