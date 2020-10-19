const primitive = require('./primitive.js');
const blocks = require('./blocks.js');
const serializeBlock = require('./serialize_blocks.js')

/**
* A single execution branch
* @extends Array
*/
class Branch extends Array {
  /**
  * @constructor
  * @param {object} Sb3
  */
  constructor(Sb3) {
    super();
    this.Sb3 = Sb3
  }

  /**
  * return the first block
  * @return {Block}
  */
  first() {
    return this[0];
  }

  /**
  * return the last block
  * @return {Block}
  */
  last() {
    return this[this.length - 1];
  }

  block(name, ...args) {
    args.forEach((arg, i) => {
      if (typeof arg === 'string'
          || typeof arg === 'number'
          || arg instanceof this.Sb3.Variable
          || arg instanceof this.Sb3.List
        )
        {args[i] = primitive(arg);}
    });
    const block = blocks.get(name).instance(...args);
    if (block.template.flags.includes('reporter')
        || block.template.flags.includes('primitive'))
    {} else {
      this.push(block);
    }
    return block;
  }

  /**
  * update the next and parent attributes
  */
  link() {
    this.first().makeTopLevel();
    const self = this;
    self.forEach((block, i) => {
      if (block.child) block.child.parent = block;
      if (block !== self.last())  block.next = self[i+1];
      if (block !== self.first()) block.parent = self[i-1];
    });
  }

  serialize(target) {
    if (this.first())
    serializeBlock.serializeAllChildren(this.first(), target);
  }
}

module.exports = Branch;
