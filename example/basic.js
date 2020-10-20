// require
const Sb3 = require('sb3');

// create a project
const project = new Sb3();

// get the main execution branch
const ctx = project.main;

// create some blocks
ctx.block('event.whenflagclicked');                             // [^When Green Flag Clicked]
ctx.block('motion.gotoxy', 100, ctx.block('motion.xposition')); // [goto x:(100) y:(x position)]

// write the file
project.export(path);
