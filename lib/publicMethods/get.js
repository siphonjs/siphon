/**
* @description Stores urls for GET request on the siphon object
* @param {Array || String} urls - The url(s) of the target website(s)
* @return {Object} The siphon object to allow method chaining
*/
const get = (urls) => {
  if (!urls || (!Array.isArray(urls) && typeof urls !== 'string')) throw new Error('Please insert array of URL strings or single URL string into .get method');
  if (typeof urls === 'string') this.urls = [urls];
  else this.urls = removeDuplicateURLs(urls);
  return this;
}

const removeDuplicateURLs = (urlArray) => {
  const results = {};
  urlArray.forEach(ele => results[ele] = 'I exist');
  return Object.keys(results);
}

module.exports = get;