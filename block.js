const common = require('./common.js');

/**
* Represents a block
*/
class Block {
  /**
  * @constructor
  * @param {string} opcode    the block opcode
  * @param {object} fields    associate name with value
  * @param {object} inputs    ^
  * @param {object} mutation  ^
  */
  constructor(opcode, fields, inputs, mutation) {
    this.opcode = opcode;
    this.uuid = common.uuid();
    this.fields = fields;
    this.inputs = inputs;
    this.mutation = mutation;
    this.child = null;
    this.parent = null;
    this.next = null;
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
