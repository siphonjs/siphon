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


var counter = 0;
var proxies = [];
var jobs = [];
var temps = [];
for(let i = 90025; i < 90030; i++) {
  temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

var mySiphon = siphon()
.find(/[0-9]{2}\.[0-9]/)
.store( (datum) => { console.log(datum) })
.setURLs(temps)
.run()

//https://www.wunderground.com/cgi-bin/findweather/getForecast?query=98004
