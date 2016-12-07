/**
* @description Optionally allows use of fully rendered DOM for more complex scraping
* @param {String} browser - Can choose 'chrome' or 'firefox' instances
* @param {Function} callback - Provides space for custom selenium logic
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function selenium(browser, callback) {
  if (typeof browser !== 'string' || typeof callback !== 'function')
  this.seleniumOptions = { browser, callback };
  return this;
}
