const fs = require('fs');
const Block = require('./block.js');
const BlockTemplate = require('./blocktemplate.js');
const BlockLibrary = require('./blocklibrary.js');
const blockdata = require('./blocks.json');

const blocks = new BlockLibrary();
blocks.loadJSON(blockdata)

module.exports = blocks;
