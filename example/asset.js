// require
const Sb3 = require('../sb3.js');

// create a project
const project = new Sb3();

const asset = project.sprite.asset(
  __dirname + '/../default.png',
  'asset name',
)

// write the file
project.export(__dirname + '/asset.sb3');
