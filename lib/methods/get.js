/**
* @description Stores an http get request on the siphon object
* @param {String} url - The url of the target website
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function get(url) {
  this.url = url;
  return this;
}