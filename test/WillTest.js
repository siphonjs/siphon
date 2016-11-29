const siphon = require('./../lib/Siphon');
const http = require('http');


// var webdriver = require('selenium-webdriver'),
//   By = webdriver.By,
//   until = webdriver.until;

// var driver = new webdriver.Builder()
//   .forBrowser('chrome')
//   .build();

// driver.get('http://www.google.com/ncr');ki
// driver.findElement(By.name('q')).sendKeys('webdriver');
// driver.findElement(By.name('btnG')).click();
// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
// driver.quit();

var proxies = [];
var jobs = [];
var temps = [];
for(let i = 90025; i < 90030; i++) {
  temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

var temps = ['http://jakeaustwick.me/a-scrapers-toolkit-redis/'];
var proxs = ['http://52.53.162.98:808'];

var mySiphon = siphon()
.find(/Scraper/)
.store( (returnMessage) => { console.log(returnMessage) })
.setURLs(temps)
.setProxies(proxs)
.run()
