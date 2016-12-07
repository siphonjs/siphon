/**
* @description Stores all of the matches for a particular string and regular expression
* as an array in the data property of the siphon object
* @param {Regular Expression} regex - The regex used to scrape that defaults to the html property of the siphon object
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function find(regex) {
  if (!regex || !(regex instanceof RegExp)) throw new Error('Please insert a regular expression into .find method');
  this.searchTerms.push(regex);
  return this;
}
