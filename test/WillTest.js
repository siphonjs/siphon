const siphon = require('./../lib/Siphon');
const http = require('http');

var proxies = [];
var temps = [];
for(let i = 90025; i < 92025; i++) {
  temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

// var temps = ['http://jakeaustwick.me/a-scrapers-toolkit-redis/'];
// var proxs = ['http://52.53.162.98:808'];

var mySiphon = siphon()
.find(/[0-9]{2}\.[0-9]/)
.store( (returnMessage) => { console.log(returnMessage, 'data:', returnMessage.data.length, 'errors:', returnMessage.errors.length) })
.setURLs(temps)
.retries(4)
.run()
