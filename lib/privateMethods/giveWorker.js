/**
* @description Stores a GET request on the siphon object
* @param {String} url - The url given to workers
* @return {Object} The siphon object to allow method chaining
*/
function giveWorker(url) {
  if (typeof url !== 'string') throw new Error('Please insert URL string into giveWorker method');
  this.workerURL = url;
  return this;
}

module.exports = giveWorker;
