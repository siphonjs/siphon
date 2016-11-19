// stores all of the matches for a particular string and regular expression as an array in the data property of the siphon object
// @params a regex to use and the string to search which defaults to the html property of the siphon object

function find(regex) {
  this.searchTerms.push(regex);
  return this;
}

module.exports = find;