/**
* @description Sets the proxy values for IP rotation while scraping
* @param {Array} proxies - Each proxy in the array should be a string of a valid IP address
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function setProxies(proxies) {
  this.proxies = proxies;
  return this;
}