/**
* @description Sets the headers of the request object on the siphon object
* @param {Object} headers - Headers to change and their respective values
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function setHeaders(headers) {
  this.headers = headers;
  return this;
}