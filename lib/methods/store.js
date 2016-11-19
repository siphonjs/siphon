// saves the function passed as a property on the siphon object
// @params a callback that is applied to each item in the data property of the siphon object

module.exports = function store(cb) {
  this.storeFunction = cb;
  return this;
}