/**
* @description Sets an interval between requests
* @param {Number} inteval - The interval in milliseconds between requests
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function setInterval(interval) {
  this.interval = interval;
  return this;
}