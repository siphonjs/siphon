//method that toggles overwrite property of the siphon object
// @params bool that is true or false. defaults to true

module.exports = function overwriteData (bool = true) {
  this.overwrite = bool;
  return this;
}