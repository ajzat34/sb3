const primitive = require('./primitive.js');
const blocks = require('./blocks.js');
const serializeBlock = require('./serialize_blocks.js');
const Procedure = require('./procedure.js');
const common = require('./common.js');

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
    return symbol
  }

  /**
  * Create and define a Variable
  * @param {string} name
  * @return {Variable}
  */
  variable(name) {
    return this.define(new this.Sb3.Variable(name));
  }
  /**
  * Create and define a List
  * @param {string} name
  * @return {List}
  */
  list(name) {
    return this.define(new this.Sb3.List(name));
  }

  /**
  * @param {object | string | number} arg
  * @return {Block}
  */
  autoBlock(arg) {
    if (arg instanceof this.Sb3.Block) return arg;
    if (typeof arg === 'string'
        || typeof arg === 'number'
        || arg instanceof this.Sb3.Variable
        || arg instanceof this.Sb3.List
        || arg instanceof this.Sb3.Broadcast
      )
      {return this.primitive(arg);}
    else if (arg instanceof Branch) {
      if (arg.length) {
        arg.substack();
        return arg.first();
      } else {
        return null;
      }
    }
    return arg;
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
      args[i] = self.autoBlock(arg);
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
    const proc = new Procedure(proccode, this.branch(), warp);
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

  broadcast(block) {
    if (typeof block === 'string'
      || (block instanceof this.Sb3.Block && block.opcode === 'text'))
    {
      return this.broadcast(
        this.block('operator.join', '', block)
      );
    }
    return this.block('event.broadcast', this.autoBlock(block));
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
