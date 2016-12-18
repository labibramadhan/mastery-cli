import program from 'commander';

const ServeCommand = requireF('packages/mastery/serve/components/ServeCommand');

program
  .command('serve')
  .description('serve directly current MasteryJS server source')
  .option('-i, --inspect', 'debug using chrome developer tool')
  .option('-p, --port <n>', 'enable and specify the debugging port (--debug-brk)')
  .action((options) => {
    const serveCommand = new ServeCommand();
    serveCommand.execute(options);
  });
