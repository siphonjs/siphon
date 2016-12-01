/**
* @description Optionally allows use of fully rendered DOM for more complex scraping
* @param {String} browser - Can choose 'chrome' or 'firefox' instances
* @param {Function} callback - Provides space for custom selenium logic
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function (browser, callback) {
	this.seleniumOptions = {browser, callback};
	return this;
}

// selFunc()
// driver.get('http://www.wunderground.com');
// console.log("working");
// driver.quit();

// var webdriver = require('selenium-webdriver')
// var driver = new webdriver.Builder()
//     .forBrowser('chrome')
//     .build();
//
// driver.get('http://www.google.com/');
// driver.findElement(webdriver.By.name('q')).sendKeys('wiki');
// driver.findElement({ name: 'q'}).sendKeys(webdriver.Key.ENTER);
// // driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.wait(check_title, 1000)
// driver.quit();
//
// function check_title() {
//   var promise = driver.getTitle().then(function(title){
//     if (title === 'wiki - Google Search') {
//       console.log('success');
//     } else {
//       console.log('fail --' + title);
//     }
//   });
//   return promise;
// }


// driver.get('http://www.google.com/ncr');ki
// driver.findElement(By.name('q')).sendKeys('webdriver');
// driver.findElement(By.name('btnG')).click();
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.quit();
