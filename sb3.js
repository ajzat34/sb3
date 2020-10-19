const path = require('path');
const crypto = require('crypto')
const common = require('./common.js');
const Branch = require('./branch.js');
const Block = require('./block.js');
const BlockTemplate = require('./blocktemplate.js');
const BlockLibrary = require('./blocklibrary.js');
const blocks = require('./blocks');
const file = require('./file.js');

/**
* meta property of object
*/
class Meta {
  /**
  * @constructor
  * @param {string} semver
  * @param {string} vm
  * @param {string} agent
  */
  constructor(semver='3.0.0', vm='0.2.0', agent='sb3.js') {
    this.semver = semver
    this.vm = vm;
    this.agent = agent;
  }

  toJSON() {
    return {
      semver: this.semver,
      vm: this.vm,
      agent: this.agent,
    }
  }
}

/**
* A variable or list base
* Note: 'name' is stored as 'value' to be more compatable with original scratch code
*/
class Symbol {
  /**
  * @constructor
  * @param {string} name
  */
  constructor(name) {
    this.id = common.uuid();
    this.value = name;
  }
}

// serialize methods are for sprite.variables && sprite.lists NOT blocks
class Variable extends Symbol {
  serialize() {
    return [this.value, ''];
  }
}
class List extends Symbol {
  serialize() {
    return [this.value, []];
  }
}

/**
* A costume or Sound
*/
class Asset {
  constructor(name, filename, filedata) {
    this.name = name;
    this.file = filedata;
    const hash = crypto.createHash('md5');
    hash.update(file);
    this.md5 = hash.digest('hex');
    this.format = path.extname(filename);
    this.filename = this.md5 + '.' + this.format;
  }

  serialize() {
    return {
      assetId: this.md5,
      name: this.name,
      md5ext: this.filename,
      dataFormat: this.format,
    }
  }
}

class Costume extends Asset {
  serialize() {
    const data = super.serialize();
    data.bitmapResolution = 1;
    data.rotationCenterX = 0;
    data.rotationCenterY = 0;
    return data;
  }
}

class Sound extends Asset {
  serialize() {
    const data = super.serialize();
    return data;
  }
}

Asset.from = function(name, filename, data) {
  const fmt = path.extname(filename);
  if (fmt === 'svg') return new Costume(name, filename, data);
  if (fmt === 'png') return new Costume(name, filename, data);
  if (fmt === 'wav') return new Sound(name, filename, data);
  if (fmt === 'mp3') return new Sound(name, filename, data);
  throw new common.Error(`Unknown file type: ${fmt} in ${filename}`);
}

/**
* A sprite or stage
*/
class Target {
  /**
  * @constructor
  * @param {string} name
  * @param {bool} isStage
  */
  constructor (name, isStage) {
    this.name = name;
    this.isStage = isStage;
    this.symbols = [];
    this.branches = [];
  }

  /**
  * define a symbol (var, list, costume, or sound) on this sprite
  * @param {Variable | List | Costume | Sound} symbol
  */
  define(symbol) {
    this.symbols.push(symbol);
  }

  getContext() {
    const branch = new Branch(Sb3);
    this.branches.push(branch);
    return branch;
  }

  serialize() {
    const variables = Object.create(null);
    const lists = Object.create(null);
    const broadcasts = Object.create(null);
    const comments = Object.create(null);
    const costumes = [];
    const sounds = [];
    const blocks = {};

    this.branches.forEach((branch) => {
      branch.link();
      branch.serialize(blocks);
    });

    for (const symbol of this.symbols) {
      if (symbol instanceof Variable) variables[symbol.id] = symbol.serialize();
      if (symbol instanceof List) lists[symbol.id] = symbol.serialize();
      if (symbol instanceof Costume) costumes.push(symbol.serialize());
      if (symbol instanceof Sound) costumes.push(symbol.serialize());
      else throw new common.Error(`symbol: ${symbol} is not Variable List Costume or Sound`);
    }

    return {
      isStage: this.isStage,
      name: this.isStage? 'stage':this.name,
      variables,
      lists,
      broadcasts,
      blocks,
      comments,
      currentCostume: 0,
      costumes,
      sounds,
      volume: 100,
      layerOrder: 1,
      visable: true,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      draggable: false,
      rotationStyle: 'all around',

    }
  }
}

/**
* A Stage
*/
class Stage extends Target {
  /**
  * @constructor
  * @param {string} name
  */
  constructor(name) {
    super(name, true)
  }
}

/**
* A Sprite
*/
class Sprite extends Target {
  /**
  * @constructor
  * @param {string} name
  */
  constructor(name) {
    super(name, false)
  }
}

/**
* An sb3 project
*/
class Sb3 {
  constructor() {
    this.meta = new Meta();
    this.extentions = ['pen', 'music'];
    this.targets = [];
    this.sprite = new Sprite('Main');
    this.stage = new Stage('Stage');
    this.targets.push(this.sprite);
    this.targets.push(this.stage);
    this.main = new Branch(this.sprite.blocks);
  }

  serialize() {
    const obj = {
      targets: this.targets.map(target=>target.serialize()),
      monitors: [],
      extentions: this.extentions,
      meta: this.meta.toJSON(),
    };
    return obj;
  }
}

/**
* return the 1st sprite from the project.json
* @param {object} project
* @return {object}
*/
Sb3.locateSprite = function(project) {
  const targets = project.targets;
  for (target of targets) {
    if (!target.isStage) return target;
  }
  return null;
}

Sb3.Meta = Meta;
Sb3.Stage = Stage;
Sb3.Sprite = Sprite;
Sb3.Costume = Costume;
Sb3.Sound = Sound;
Sb3.Variable = Variable;
Sb3.List = List;
Sb3.Block = Block;
Sb3.Branch = Branch;
Sb3.BlockTemplate = BlockTemplate;
Sb3.BlockLibrary = BlockLibrary;
Sb3.file = file;
Sb3.blocks = blocks;

module.exports = Sb3;
