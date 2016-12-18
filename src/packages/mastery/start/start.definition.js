import program from 'commander';

const StartCommand = requireF('packages/mastery/start/components/StartCommand');

program
  .command('start')
  .description('start current MasteryJS server')
  .action(() => {
    const startCommand = new StartCommand();
    startCommand.execute();
  });
