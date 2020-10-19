const sb3 = require('./sb3.js');
const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');

module.exports.command = ['blocktool'];
module.exports.describe = 'Explore blocks';

exports.handler = async function(argv) {
  const categories = Array.from(sb3.blocks.categories());
  const category = sb3.blocks.get(
    (await inquirer.prompt([{
      type: 'list',
      name: 'main',
      message: 'Select a category',
      choices: categories
    }])).main
  );
  for (const block of category.values()) {
    console.log(block.toString())
  }
}
