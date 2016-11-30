const siphon = require('./../lib/Siphon');
const http = require('http');
// const red = require('../lib/redis/redisController');

var temps = [];

for(let i = 90025; i < 90030; i++) {
  temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

var regularSiphon = siphon()
.setURLs(temps)
.find(/[0-9]{2}\.[0-9]/)
.retries(2)
.store( (returnMessage) => {
  console.log(returnMessage);
  console.log('errors: ', returnMessage.errors.length, 'data: ', returnMessage.data.length);
})
.run()

// red.enqueue(mySiphon);
// red.rpoplpush('jobsQueue', function (siphonObject) {
//   console.log(siphonObject);
//   siphonObject.run();
// });

var seleniumSiphon = siphon()
.setURLs(temps)
.selenium('chrome', (driver) => {
  data = driver.findElement({className: 'city-nav-header'}).getText()
  driver.quit();
  return data;
})
.store( (returnMessage) => {
  console.log(returnMessage);
  console.log('errors: ', returnMessage.errors.length, 'data: ', returnMessage.data.length);
})
.run()
