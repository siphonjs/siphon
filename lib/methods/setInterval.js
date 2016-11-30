// sets an interval between requests
// @params the interval in milliseconds between requests

module.exports = function setInterval(interval) {
  this.interval = interval;
  return this;
}