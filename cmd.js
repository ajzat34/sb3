const yargs = require('yargs');
yargs
.command(require('./inspect.js'))
.strict()
.demandCommand()
.help()
.wrap(Math.min(100, process.stdout.columns || 100))
.argv;
