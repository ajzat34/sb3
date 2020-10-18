class Sb3Error extends Error {
  /**
  * @param {string} message
  * @param {string | number} code
  */
  constructor(message, code) {
    super('Sb3: ' + message);
    this.code = code;
    this.raw_message = message;
  }
}

module.exports = Sb3Error
