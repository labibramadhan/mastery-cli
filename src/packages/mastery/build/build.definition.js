import program from 'commander';

const BuildCommand = require('./components/BuildCommand');

program
  .command('build')
  .description('build current MasteryJS project')
  .action(() => {
    const buildCommand = new BuildCommand();
    buildCommand.execute(arguments);
  });
