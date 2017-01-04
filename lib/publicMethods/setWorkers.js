/**
* @description Sets the numWorkers property of the siphon object
* @param {Number} num - Allows a customized number of workers to be instantiated (defaults to the number of CPU cores)
* @return {Object} The siphon object to allow method chaining
*/
function setWorkers(num) {
  if (!Number.isInteger(num)) throw new Error('Please insert integer into .setWorkers method');
  this.numWorkers = num;
  return this;
}

module.exports = setWorkers;