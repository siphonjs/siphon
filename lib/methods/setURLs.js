//sets the urlArray property of the Siphon object
// @params array of urls to scrape

module.exports = function setURLs (urls) {
  this.urlArray = urls;
  return this;
}