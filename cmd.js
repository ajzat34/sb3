#!/usr/bin/env node
const yargs = require('yargs');
yargs
.command(require('./inspect.js'))
.command(require('./genblocks.js'))
.command(require('./blocktool.js'))
.command(require('./dump.js'))
.strict()
.help()
.wrap(Math.min(100, process.stdout.columns || 100))
.argv;
