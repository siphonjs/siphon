/**
* @description Allows user to search HTML with Cheerio or Regex
* @param {Function} callback - Passed HTML from request
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function processHtml(callback) {
  if (!(callback instanceof Function)) throw new Error('Please insert callback function into .processHtml method');
  this.html = callback;
  return this;
}