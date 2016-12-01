//sets the headers of the request object on the siphon object
// @params an object containing the headers to change and their respective values

module.exports = function setHeaders(headers) {
  this.headers = headers;
  return this;
}