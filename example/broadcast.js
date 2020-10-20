const Sb3 = require('../sb3.js');
const project = new Sb3();
const ctx = project.main;

// when green flag clicked block
ctx.block('event.whenflagclicked');

// create a broadcast symbol
const test = new Sb3.Broadcast('test');
// IMPORTANT: define the symbol on the stage
project.stage.define(test);
// create a new branch
ctx.branch(ctx=>{
  // create a header for the broadcast
  ctx.block('event.whenbroadcastreceived', test);
  // YOUR BLOCKS HERE
  ctx.block('motion.gotoxy', 100,0);
})

// emit the broadcast
ctx.broadcast(test);   // by symbol
ctx.broadcast("test"); // by block/string

project.export(__dirname + '/broadcast.sb3');
