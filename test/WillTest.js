const siphon = require('./../lib/Siphon');
const http = require('http');

var temps = [];

for(let i = 90025; i < 91025; i++) {
  temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

var regularSiphon = siphon()
.setURLs(temps)
.find(/[0-9]{2}\.[0-9]/)
.retries(2)
.store( (data) => {
  // console.log(data);
})
// .selenium('chrome', (driver) => {
//   data = driver.findElement({className: 'city-nav-header'}).getText()
//   driver.quit();
//   return data;
// })
// .setInterval(2000)
.run()
