import program from 'commander';

const ConfCommand = requireF('packages/cli/conf/components/ConfCommand');

program
  .command('conf [key] [value]')
  .description('Change MasteryJS CLI configurations')
  .action((key, value) => {
    const confCommand = new ConfCommand();
    confCommand.execute(key, value);
  });
