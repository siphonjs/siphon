const siphon = require('./../lib/Siphon');
const http = require('http');

var webdriver = require('selenium-webdriver')
var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('http://www.google.com/');
driver.findElement(webdriver.By.name('q')).sendKeys('wiki');
driver.findElement({ name: 'q'}).sendKeys(webdriver.Key.ENTER);
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
driver.wait(check_title, 1000)
driver.quit();

function check_title() {
  var promise = driver.getTitle().then(function(title){
    if (title === 'wiki - Google Search') {
      console.log('success');
    } else {
      console.log('fail --' + title);
    }
  });
  return promise;
}


// driver.get('http://www.google.com/ncr');ki
// driver.findElement(By.name('q')).sendKeys('webdriver');
// driver.findElement(By.name('btnG')).click();
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.quit();

var proxies = [];
var jobs = [];
var temps = [];
for(let i = 90000; i < 90500; i++) {
  temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

var mySiphon = siphon()
.find(/[0-9]{2}\.[0-9]/)
.store( (returnMessage) => {
  console.log(returnMessage);
  console.log('errors: ', returnMessage.errors.length, 'data: ', returnMessage.data.length);
})
.retries(2)
.setURLs(temps)
.run()

//https://www.wunderground.com/cgi-bin/findweather/getForecast?query=98004
