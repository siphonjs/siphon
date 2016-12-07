/**
* @description Stores a GET request on the siphon object
* @param {String} url - The url given to workers
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function giveWorker(url) {
  this.workerURL = url;
  return this;
}