const siphon = require('./../lib/Siphon');
// const http = require('http');


// var proxies = [];
// var jobs = [];
// var temps = [];
// for(let i = 90025; i < 90030; i++) {
//   temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
// }
//
// var temps = ['http://jakeaustwick.me/a-scrapers-toolkit-redis/'];
// var proxs = ['http://52.53.162.98:808'];
//
// var mySiphon = siphon()
// .find(/[0-9]{2}\.[0-9]/)
// .store( (returnMessage) => {
//   console.log(returnMessage);
//   console.log('errors: ', returnMessage.errors.length, 'data: ', returnMessage.data.length);
// })
// .retries(2)
// .find(/Scraper/)
// .store( (returnMessage) => { console.log(returnMessage) })
// .setURLs(temps)
// .setProxies(proxs)
// .run()

var mySiphon = siphon().selenium();

//https://www.wunderground.com/cgi-bin/findweather/getForecast?query=98004
