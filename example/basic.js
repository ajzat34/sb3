// import Sb3
const Sb3 = require('../sb3.js');
// create a project
const project = new Sb3();
// get the main sprites blocks
const ctx = project.sprite.blocks;
// create some blocks
ctx.block('event.whenflagclicked');                             // [^When Green Flag Clicked]
ctx.block('motion.gotoxy', 100, ctx.block('motion.xposition')); // [goto x:(100) y:(x position)]
// write the file
project.export(__dirname + '/basic.sb3');
