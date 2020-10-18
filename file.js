const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const common = require('./common.js')

/**
* Error for file manipulation
*/
class FileError extends common.Error {
}

module.exports.FileError = FileError;

/**
* unzip a file
* zip.project is a parsed project.json
* @param {string} file
* @return {Promise<JSZip>}
*/
async function load(file) {
  const zipdata = await fs.promises.readFile(file);
  const data = await JSZip.loadAsync(zipdata);
  try {
    data.project = JSON.parse(await data.file('project.json').async('string'));
  } catch (err) {
    throw new FileError('project.json not found, are you sure this is an Sb3 file?', 'EPJSON');
  }
  return data;
}

module.exports.load = load;
