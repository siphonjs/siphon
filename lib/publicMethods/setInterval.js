/**
* @description Sets an interval between requests
* @param {Number} inteval - The interval in milliseconds between requests
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function setInterval(interval) {
  if (typeof interval !== 'number') throw new Error('Please insert number into .setInterval method');
  this.interval = interval;
  return this;
}