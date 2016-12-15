import program from 'commander';

const NewCommand = requireF('packages/mastery/new/components/NewCommand');

program
  .command('new [destination]')
  .description('create a new MasteryJS project')
  .action((destination = '.') => {
    const newCommand = new NewCommand();
    newCommand.execute(destination);
  });
