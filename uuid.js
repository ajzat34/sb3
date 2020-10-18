/**
* genorate a uuid
* @param {number} len
* @return {string}
*/
module.exports = function(len=20) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890^|+=()_`*!@#$%[]';
  const charactersLength = characters.length;
  for ( let i = 0; i < len; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
