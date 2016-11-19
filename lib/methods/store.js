// saves the function passed as a property on the siphon object
// @params a callback that is applied to the data property of the siphon object

module.exports = function store(cb) {
  this.storeFunction = cb;
  return this;
}