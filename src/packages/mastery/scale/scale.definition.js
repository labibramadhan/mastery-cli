import program from 'commander';

const ScaleCommand = requireF('packages/mastery/scale/components/ScaleCommand');

program
  .command('scale [length]')
  .description('scale current MasteryJS server cluster processes')
  .action((length) => {
    const scaleCommand = new ScaleCommand();
    scaleCommand.execute(length);
  });
