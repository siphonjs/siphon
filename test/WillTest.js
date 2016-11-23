const siph = require('./../lib/Siphon');
const http = require('http');

var counter = 0;
var proxies = [];
var jobs = [];
var temps = [];
for(let i = 90025; i < 90030; i++) {
  temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

var mySiphon = siph()
.find(/[0-9]{2}\.[0-9]/)
.store( (datum) => { console.log(datum) })
.get('https://www.wunderground.com/cgi-bin/findweather/getForecast?query=90025')
.run()
