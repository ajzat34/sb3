class Sb3Error extends Error {
  /**
  * @param {string} message
  * @param {string | number} code
  */
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

module.exports = Sb3Error
