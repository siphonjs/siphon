/**
* @description Optionally allows use of fully rendered DOM for more complex scraping
* @param {String} browser - Can choose 'chrome' or 'firefox' instances
* @param {Function} callback - Provides space for custom selenium logic
* @return {Object} The siphon object to allow method chaining
*/
function selenium(browser, callback) {
  if (typeof browser !== 'string' || typeof callback !== 'function') {
    throw new Error('Please insert valid browser string as first parameter AND function callback as second parameter for .selenium method');
  }

  this.seleniumOptions = { browser, callback };
  return this;
}

module.exports = selenium;