const siph = require('./../lib/Siphon');
const http = require('http');

var counter = 0;
var proxies = [];

var mySiphon = siph()
// .get('https://www.wunderground.com/cgi-bin/findweather/getForecast?query=90025')
.find(/[0-9]{2}\.[0-9]/)
.store( (datum) => {
  console.log(datum);
})

for(let i = 90025; i < 90030; i++) {
  mySiphon.get(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`)
  // .setProxy('http://201.243.152.108:8080')
  .execute()
}

