const Sb3 = require('./sb3.js');

const project = new Sb3();

const ctx = project.sprite.blocks;
const myVar = new Sb3.Variable();
ctx.define(myVar);

ctx.block('event.whenflagclicked');
ctx.block('data.setvariableto', myVar, 1);
ctx.block(
  'control.if',
  ctx.branch(ctx=>{
    ctx.block('motion.gotoxy', ctx.block('motion.xposition'), myVar);
  }),
  ctx.block('operator.equals', 1,1)
);

ctx.branch(ctx=>{
  ctx.block('event.whenflagclicked');
  ctx.block('motion.setx', ctx.block('sensing.timer'));
})

const test = ctx.procedure('test', true, ctx=>{
  ctx.block('motion.setx', ctx.block('sensing.timer'));
})

ctx.callProcedure(test);

// console.log(JSON.stringify(project.serialize()))
// console.log(project.serialize().targets[0].blocks);
project.export('test.sb3');
