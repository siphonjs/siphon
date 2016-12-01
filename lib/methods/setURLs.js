/**
* @description Sets the urlArray property of the siphon object
* @param {Array} urls - Array of urls to scrape
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function setURLs(urls) {
  this.urlArray = urls;
  return this;
}