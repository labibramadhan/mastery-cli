import program from 'commander';

const StopCommand = requireF('packages/mastery/stop/components/StopCommand');

program
  .command('stop')
  .description('stop a running MasteryJS server')
  .action(() => {
    const stopCommand = new StopCommand();
    stopCommand.execute();
  });
