import program from 'commander';

const NewCommand = requireF('packages/mastery/new/components/NewCommand');

program
  .command('new')
  .description('create a new MasteryJS project')
  .action(() => {
    const newCommand = new NewCommand();
    newCommand.execute(arguments);
  });
