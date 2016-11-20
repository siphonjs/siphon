//function to store an http get request on the siphon object
// @params include the url
module.exports = function get (url) {
  this.url = url;
  return this;
}