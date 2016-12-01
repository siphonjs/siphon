/**
* @description Saves the function callback as a property on the siphon object to later be used to
* store data in a database
* @param {Function} callback - Applied to each item in the data property of the siphon object
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function store(callback) {
  this.storeFunction = callback;
  return this;
}