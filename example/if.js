const Sb3 = require('sb3');
const project = new Sb3();
const ctx = project.main;

// when green flag clicked block
ctx.block('event.whenflagclicked');
// create an if block
ctx.block(
  'control.if',
  // this is the branch executed if the condition is true
  ctx.branch(ctx=>{ // create a branch
    // add a block
    ctx.block('motion.gotoxy', 0,0);
  }),
  // this is the condition
  ctx.block('operator.equals', 1,1)  // == operator
);

project.export(__dirname + '/if.sb3');
