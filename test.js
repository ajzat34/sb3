const Sb3 = require('./sb3.js');

const project = new Sb3();

const ctx = project.sprite.getContext();
ctx.block('event.whenflagclicked');
ctx.block('motion.gotoxy', ctx.block('motion.xposition'), 100);

// console.log(JSON.stringify(project.serialize()))
// console.log(project.serialize().targets[0].blocks);
project.export('test.sb3');
