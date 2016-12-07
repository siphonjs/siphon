/**
* @description Allows user to search HTML with Cheerio
* @param {Function} callback - Passed HTML from request
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function cheerio(callback) {
  if (!callback || !(callback instanceof Function)) throw new Error('Please insert callback function into .cheerio method');
  this.cheerioFunction = callback;
  return this;
}