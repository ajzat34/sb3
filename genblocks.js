const sb3 = require('./sb3.js');
const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');

module.exports.command = ['genblocks <target>'];
module.exports.describe = 'Genorate a blocks.json from an sb3';

exports.handler = async function(argv) {
  const filepath = path.resolve(process.cwd(), argv.target);
  const data = await sb3.file.load(filepath);
  const blocks = sb3.locateSprite(data.project).blocks;
  const lib = new sb3.BlockLibrary();
  console.log('Loading blocks');
  Object.values(blocks).forEach((block) => {
    const template = sb3.BlockTemplate.fromSb3(block)
    lib.set(template);
  });
  await fs.promises.writeFile(path.resolve(__dirname, 'blocks.json'), JSON.stringify(lib));
  lib.blocks().forEach((block, i) => {
    console.log(' - ' + block.toString());
  });
}
