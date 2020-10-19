const sb3 = require('./sb3.js');
const path = require('path');

module.exports.command = ['dump <target>'];
module.exports.describe = 'Dump the project.json of an SB3 File';

exports.handler = async function(argv) {
  const filepath = path.resolve(process.cwd(), argv.target);
  const data = await sb3.file.load(filepath);
  console.log(JSON.stringify(data.project));
}
