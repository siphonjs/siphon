//sets the numWorkers property of the siphon object
// @params number of workers to instantiate, defaults to the number of CPU cores

module.exports = function setWorkers(num) {
  this.numWorkers = num ? num: require('os').cpus().length;
  return this;
}