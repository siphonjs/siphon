/**
* @description If .selenium is called, load web driver and execute with Selenium API
* @param {Object} seleniumOptions - passed in by the user as { browser, callback }
* @param {String} workerURL - acts as ID for current job
* @param {Function} storeFunction - stores data in database according to callback configuration
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function executeSelenium(seleniumOptions, workerURL, storeFunction) {
  const webdriver = require('selenium-webdriver');
  const driver = new webdriver.Builder().forBrowser(seleniumOptions.browser).build();
  driver.get(workerURL);
  
  seleniumOptions.callback(driver).then((data) => {
    process.send({
      type: 'data',
      data: { data, url: workerURL }
    });
  }).catch((err) => {
    process.send({
      type: 'error',
      error: { description: 'Selenium connection error', error: err, url: workerURL }
    });
  });
}
