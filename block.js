const common = require('./common.js');

/**
* Represents a block
*/
class Block {
  /**
  * @constructor
  * @param {BlockTemplate} template    the block template
  * @param {object} fields    associate field name with value
  * @param {object} inputs    ^
  * @param {object} mutation  ^
  */
  constructor(template, fields, inputs, mutation) {
    this.template = template;
    this.opcode = template.opcode;
    this.id = common.uuid();
    this.fields = fields;
    this.inputs = inputs;
    this.mutation = mutation;
    this.child = null;
    this.parent = null;
    this.next = null;
    this.topLevel = false;
  }

  makeTopLevel() {
    this.topLevel = true;
    this.x = 0;
    this.y = 0;
  }

  /**
  * Specify a "next" for block linking
  * @param {Block} block
  */
  setChild(block) {
    this.child = block;
  }
}

module.exports = Block;
