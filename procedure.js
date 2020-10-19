class Procedure {
  constructor(proccode, branch, warp) {
    this.proccode = proccode;
    this.branch = branch;
    this.warp = warp;
    branch.block('procedures.definition',
      branch.blocks.get('procedures.prototype').instance('mutation', [], proccode, '[]', '[]', '[]', warp)
    );
  }

  createCallBlock(branch) {
    branch.push(branch.blocks.get('procedures.call').instance('mutation', [], this.proccode, '[]', this.warp));
  }
}


module.exports = Procedure;
