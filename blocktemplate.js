const Block = require('./block.js');
const reporters = require('./reporters.json');
const bools = require('./bools.json');

/**
* Copy all items by key in list from source to target
* @param {object} target
* @param {object} source
* @param {Array} list
*/
function checkadd(target, source, list) {
  if (!Array.isArray(list)) throw new Error(`argument for list must be array`);
  for (key of list) {
    if (!(key in source)) throw new Error(`value for ${key} missing`);
    target[key] = source[key];
  }
}

/**
* Shift items
* @param {object} target
* @param {Array} values
* @param {Array} list
*/
function shiftInto(target, values, list) {
  if (!Array.isArray(list)) throw new Error(`argument for list must be array`);
  for (key of list) {
    const next = values.shift();
    if (!next) throw new Error(`ran out of values at ${key}`)
    target[key] = next;
  }
}

/**
* Template of a scratch block
*/
class BlockTemplate {
  /**
  * @constructor
  * @param {string} opcode
  * @param {object} fields
  * @param {object} inputs
  * @param {object} mutation
  * @param {Array | undefined} flags
  */
  constructor(opcode, fields=[], inputs=[], mutation=[], flags=[]) {
    this.opcode = opcode;
    if (opcode.indexOf('_') > 0) {
      this.category = opcode.substr(0, opcode.indexOf('_'));
      this.name = opcode.substr(opcode.indexOf('_')+1);
    } else {
      this.category = 'misc'
      this.name = opcode;
    }

    this.fullname = this.category + '.' + this.name;
    this.fields = fields || [];
    this.inputs = inputs || [];
    this.mutation = mutation || [];
    this.args = [].concat(fields, inputs, mutation);
    this.flags = flags;
  }

  /**
  * create an object associating arguments with their values
  * by passing its arguments in the order: fields, inputs, mutation
  * @return {Block}
  */
  createArgs(...args) {
    const all = Object.create(null);
    shiftInto(all, args, this.args);
    if (args.length) throw new Error(`Too many arguments for ${this.opcode}`);
    return all;
  }

  /**
  * Instance a block from an object defining its fields, inputs, and mutation
  * @param {object} obj keys = name of field|input|mutation
  * @return {Block}
  */
  instanceArgs(obj) {
    // create param scopes
    const fields = Object.create(null);
    const inputs = Object.create(null);
    const mutation = Object.create(null);
    checkadd(fields, obj, this.fields);
    checkadd(inputs, obj, this.inputs);
    checkadd(mutation, obj, this.mutation);
    return new Block(this, fields, inputs, mutation);
  }

  /**
  * Instance a block by passing its arguments in order: fields, inputs, mutation
  * @return {Block}
  */
  instance(...args) {
    return this.instanceArgs(this.createArgs(...args));
  }

  /** @return {string} */
  toString() {
    return `${this.fullname}(${this.args.join(', ')})<${this.flags.join(', ')}>`
  }

  toJSON() {
    return [this.opcode, this.fields, this.inputs, this.mutation, this.flags];
  }
}

/**
* Create a BlockTemplate from a JSON array (result of BlockTemplate.toJSON)
* @return {BlockTemplate}
*/
BlockTemplate.fromJSON = function (a) {
  return new BlockTemplate(...a);
}

BlockTemplate.fromSb3 = function (block) {
  const opcode = block.opcode;
  const fields = Object.keys(block.fields);
  const inputs = Object.keys(block.inputs);
  const mutation = Object.keys(block.mutation || []);
  const flags = [];
  if (block.shadow) flags.push('shadow');
  if (reporters.includes(opcode)) flags.push('reporter');
  if (bools.includes(opcode)) flags.push('bool');
  return new BlockTemplate(opcode, fields, inputs, mutation, flags);
}

module.exports = BlockTemplate
