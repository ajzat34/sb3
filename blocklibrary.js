/*
A library of all the blocks
*/

const Block = require('./block.js');
const BlockTemplate = require('./blocktemplate.js');
const common = require('./common.js');

class BlockLibrary {
  constructor() {
    this.opcode = {};
    this.name = {};
    this.category = new Map();
  }

  get(name) {
    if (name in this.opcode)     return this.opcode[name];
    if (name in this.name)       return this.name[name];
    if (this.category.has(name)) return this.category.get(name);
    throw new common.Error(`${name} is not a opcode, blockname, or category name`);
  }

  set(block) {
    this.opcode[block.opcode] = block;
    this.name[block.fullname] = block;
    if (!this.category.has(block.category)) this.category.set(block.category, new Map());
    this.category.get(block.category).set(block.name, block);
  }

  categories() {
    return this.category.keys();
  }

  blocks() {
    const blocks = [];
    for (const cat of this.categories())
    for (const block of this.get(cat).values())
        blocks.push(block);
    return blocks;
  }

  toJSON() {
    return this.blocks();
  }

  /**
  * @param {Array} arr
  * @return {BlockLibrary}
  */
  loadJSON(arr) {
    for (const block of arr) {
      this.set(BlockTemplate.fromJSON(block));
    }
    return this;
  }
}

module.exports = BlockLibrary
