/**
* A single execution branch
* @extends Array
*/
class Branch extends Array {
  /**
  * @constructor
  */
  constructor() {
    super();
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
  * update the next and parent attributes
  */
  link() {
    const self = this;
    self.forEach((block, i) => {
      if (block.child) block.child.parent = block;
      if (self.last() !== block)  block.next = self[i+1];
      if (self.first() !== block) block.parent = self[i-1];
    });
  }
}

module.exports = Branch;
