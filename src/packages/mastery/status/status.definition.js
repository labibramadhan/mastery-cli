import program from 'commander';

const StatusCommand = requireF('packages/mastery/status/components/StatusCommand');

program
  .command('status')
  .description('check MasteryJS instances status')
  .action(() => {
    const statusCommand = new StatusCommand();
    statusCommand.execute();
  });
