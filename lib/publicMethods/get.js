/**
* @description Stores urls for GET request on the siphon object
* @param {Array || String} urls - The url(s) of the target website(s)
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function get(urls) {
  if (!Array.isArray(urls) && typeof urls !== 'string') throw new Error('Please insert array of URL strings or single URL string into .get method');
  if (typeof urls === 'string') this.urls.push(urls);
  else this.urls = this.urls.concat(urls);
  return this;
}