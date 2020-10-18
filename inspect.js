const sb3 = require('./index.js');
const path = require('path');

module.exports.command = ['inspect <target>', '$0'];
module.exports.describe = 'Inspect an SB3 File';

exports.handler = async function(argv) {
  const filepath = path.resolve(process.cwd(), argv.target);
  const data = await sb3.file.load(filepath);
  console.log('Directory:')
  listFiles(data);
}

function listFiles(zip) {
  const names = Object.keys(zip.files)
  names.forEach((name, i) => {
    console.log('->', name);
  });
}
