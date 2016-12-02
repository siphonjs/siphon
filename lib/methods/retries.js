/**
* @description Updates the number of tries on the siphon object
* @param {Number} triesToAdd - Allows additional tries for each job (defaults to 1)
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function retries(triesToAdd = 1) {
  this.tries += triesToAdd;
  return this;
}