/**
* @description Sets the headers of the request object on the siphon object
* @param {Object} headers - Headers with their respective values
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function setHeaders(headers) {
  if (typeof headers !== 'object' || headers === null) {
    throw new Error('Please insert a valid header object into .setHeaders method');
  }

  this.headers = headers;
  return this;
}