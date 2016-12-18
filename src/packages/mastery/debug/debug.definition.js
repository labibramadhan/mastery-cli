import program from 'commander';

const DebugCommand = requireF('packages/mastery/debug/components/DebugCommand');

program
  .command('debug')
  .description('debug current MasteryJS project')
  .option('-i, --inspect', 'debug using chrome developer tool')
  .option('-p, --port <n>', 'enable and specify the debugging port (--debug-brk)')
  .action((options) => {
    const debugCommand = new DebugCommand();
    debugCommand.execute(options);
  });
