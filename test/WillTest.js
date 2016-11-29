const siphon = require('./../lib/Siphon');
const http = require('http');


var proxies = [];
var temps = [];

for(let i = 90025; i < 91025; i++) {
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

// driver.get('http://www.wunderground.com');
// console.log("working");
// driver.quit();
//
// var mySiphon = siphon()
// .get('http://www.wunderground.com')
// .selenium('chrome', driver => {
//   const currentLocation = driver
//     .findElement({className: 'fi-target-two'})
//     .click()
//
//   return currentLocation;
// })
// .execute();

//https://www.wunderground.com/cgi-bin/findweather/getForecast?query=98004
