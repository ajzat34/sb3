const path = require('path');
const crypto = require('crypto')
const common = require('./common.js');
const Branch = require('./branch.js');
const Block = require('./block.js');

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
  constructor(semver='3.0.0', vm='0.2.0', agent='sb3.js Mozilla') {
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
*/
class Symbol {
  /**
  * @constructor
  * @param {string} name
  */
  constructor(name) {
    this.id = common.uuid();
    this.name = name,
  }
}

class Variable extends Symbol {
  serialize() {
    return [this.name, ''];
  }
}
class List extends Symbol {
  serialize() {
    return [this.name, []];
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
  }

  /**
  * define a symbol (var, list, costume, or sound) on this sprite
  * @param {Variable | List | Costume | Sound} symbol
  */
  define(symbol) {
    this.symbols.push(symbol);
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
    this.sprite = new Sprite('MAIN');
    this.stage = new Stage('Stage');
    this.targets.push(this.sprites);
    this.targets.push(this.stage);
    this.main = new Branch(this.sprite.blocks);
  }

  serialize() {
    const obj = {
      targets: this.targets.map(((target)=>{return target.serialize()})),
      monitors: [],
      extentions: this.extentions,
      meta: this.meta.toJSON(),
    };
    return obj;
  }
}
