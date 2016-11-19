//sets the headers of the request object on the siphon object
// @params an object containing the headers to change and their respective values

module.exports = function setHeaders(headers) {
  Object.keys(headers).forEach( (header) => this.request.setHeader(header, headers[header]));
  return this;
}