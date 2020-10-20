const Sb3 = require('../sb3.js');
const project = new Sb3();
const ctx = project.main;
// create a variable
const myVar = ctx.variable();
ctx.block('event.whenflagclicked');                    // [^When Green Flag Clicked]
ctx.block('data.setvariableto', myVar, "Hello World"); // [Set (myVar) to (Hello Word)]
ctx.block('looks.say', myVar);                         // [Say (myVar)]
project.export(__dirname + '/variable.sb3');
