const primitive = require('./primitive.js');
const blocks = require('./blocks.js');
const serializeBlock = require('./serialize_blocks.js')
const Procedure = require('./procedure.js')

var y = 0;

/**
* A single execution branch
* @extends Array
*/
class Branch extends Array {
  /**
  * @constructor
  * @param {object} Sb3
  */
  constructor(Sb3, target) {
    super();
    this.Sb3 = Sb3
    this.target = target;
    this.totalBlocks = 0;
    this.topLevel = true;
    this.build_children = [];
    this.blocks = blocks;
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

  /**
  * See Sb3.Target.define
  */
  define(symbol) {
    this.target.define(symbol);
  }

  /**
  * create a block
  * @param {string} name the opcode, or category.name of the block
  * @param {...*} args the arguments to the block
  * @return {object}
  */
  block(name, ...args) {
    const self = this;
    this.totalBlocks++;
    args.forEach((arg, i) => {
      if (typeof arg === 'string'
          || typeof arg === 'number'
          || arg instanceof self.Sb3.Variable
          || arg instanceof self.Sb3.List
        )
        {args[i] = self.primitive(arg);}
      else if (arg instanceof Branch) {
        if (!arg.length) throw new Error(`Cannot pass empty branch as argument, ${arg.totalBlocks} where defined, but none are chained`);
        arg.substack();
        args[i] = arg.first();
      }
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
  * Create a primitive block
  * @param {string|number|Variable|List} data
  */
  primitive(data) {
    return primitive(this.Sb3, data);
  }

  /**
  * @param {function(Branch)|undefined} callback
  * @return {Branch}
  */
  branch(callback) {
    const branch = new Branch(this.Sb3, this.target);
    this.build_children.push(branch);
    if (callback) callback(branch);
    return branch;
  }

  /**
  * @param {string} proccode
  * @param {bool} warp "run without screen refresh"
  * @param {function(Branch)|undefined} callback
  * @return {Procedure}
  */
  procedure(proccode, warp, callback) {
    const proc = new Procedure(proccode, this.branch(), warp)
    if (callback) callback(proc.branch);
    return proc;
  }

  /**
  * Call a procedure
  * @param {Procedure} procedure
  */
  callProcedure(procedure) {
    procedure.createCallBlock(this);
  }

  substack() {
    this.topLevel = false;
    return this;
  }

  /**
  * update the next and parent attributes
  */
  link() {
    if (this.topLevel && this.length) {
      this.first().makeTopLevel();
      this.first().y = y;
      y += 100;
    }
    this.build_children.forEach((child, i) => {
      child.link();
    });
    if (!this.length) return;
    const self = this;
    self.forEach((block, i) => {
      if (block !== self.last())  block.next = self[i+1];
      if (block !== self.first()) block.parent = self[i-1];
      Object.values(block.inputs).forEach((input, i) => {
        if (input instanceof this.Sb3.Block) input.parent = block;
      });
    });
  }

  serialize(target) {
    if (this.first())
    serializeBlock.serializeAllChildren(this.first(), target);
    this.build_children.forEach((child, i) => {
      child.serialize(target);
    });
  }
}

module.exports = Branch;
