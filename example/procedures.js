const Sb3 = require('../sb3.js');
const project = new Sb3();
const ctx = project.main;

// when green flag clicked block
ctx.block('event.whenflagclicked');
// create a procedure                                                  /- run without screen refresh
const myProcedure = ctx.procedure('procedure name (must be unique)', true, ctx=>{
  // add blocks here
  ctx.block('motion.setx', ctx.block('sensing.timer'));
})

// call the procedure
ctx.callProcedure(myProcedure);

project.export(__dirname + '/procedures.sb3');
