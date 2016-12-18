import program from 'commander';

const ReloadCommand = requireF('packages/mastery/reload/components/ReloadCommand');

program
  .command('reload')
  .description('reload current MasteryJS server')
  .action(() => {
    const reloadCommand = new ReloadCommand();
    reloadCommand.execute();
  });
