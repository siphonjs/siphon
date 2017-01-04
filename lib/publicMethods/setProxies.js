/**
* @description Sets the proxy values for IP rotation while scraping
* @param {Array} proxies - Each proxy in the array should be a string of a valid IP address
* @return {Object} The siphon object to allow method chaining
*/
function setProxies(proxies) {
  if (!Array.isArray(proxies)) throw new Error('Please insert array of proxy strings into .setProxies method');
  this.proxies = proxies;
  return this;
}

module.exports = setProxies;