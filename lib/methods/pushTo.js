/**
* @description Need to build out to push to Redis queue
* @param tbd
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function pushTo(array) {
  array.push(this);
  return this;
}