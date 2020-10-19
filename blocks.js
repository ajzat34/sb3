const fs = require('fs');
const Block = require('./block.js');
const BlockTemplate = require('./blocktemplate.js');
const BlockLibrary = require('./blocklibrary.js');
const blockdata = require('./blocks.json');
const primitive = require('./primitive.js');

const blocks = new BlockLibrary();
blocks.loadJSON(blockdata);
for (const template of primitive.templates) blocks.set(template);

module.exports = blocks;
