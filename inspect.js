const sb3 = require('./index.js');
const path = require('path');
const inquirer = require('inquirer');

module.exports.command = ['inspect <target>', '$0'];
module.exports.describe = 'Inspect an SB3 File';

exports.handler = async function(argv) {
  const filepath = path.resolve(process.cwd(), argv.target);
  const data = await sb3.file.load(filepath);
  console.log('Files')
  listFiles(data);
  await menu(data.project);
}

function listFiles(zip) {
  const names = Object.keys(zip.files)
  names.forEach((name, i) => {
    console.log(' :', name);
  });
}

function genMenu(data) {
  const choices = []
  Object.keys(data).forEach((key, i) => {
    var name;
    if (typeof data[key] === 'object') name = key + ': [object]'
    else name = key + ': ' + data[key];
    choices.push({
      name,
      value: data[key]
    })
  });
  choices.push({name: 'Exit', value: '%__exit__%'})
  return [{
    type: 'list',
    name: 'main',
    choices,
  }]
}

async function menu(data) {
  const resp = (await inquirer.prompt(genMenu(data))).main
  if (resp === '%__exit__%') return;
  if (typeof resp === 'object') return await menu(resp);
  console.log(resp);
  return resp;
}
