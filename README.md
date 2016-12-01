# Siphon
Siphonjs is an easy-to-use data extraction library for Nodejs that is designed to work at scale by making use of Node's built-in clustering behavior by default. Siphon can make use of proxies to enable a higher volume of data extraction/web scraping. Siphon has also been set up to work on a cluster of servers with a Redis queue handling job assignment. Siphon requires the 'request' module as a dependency, and there are optional dependecies of selenium-webdriver and cheerio for jobs requiring DOM actions and full client-side rendering.


**Getting Started**----
After downloading the module, set a variable to the required library and invoke. Next, chain up your commands, finishing with "run()". Example below:

const siphon = require('./../lib/Siphon');

var temps = [];

for(let i = 90025; i < 90030; i++) {
  temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

var regularSiphon = siphon()
.setURLs(temps)
.find(/[0-9]{2}\.[0-9]/)
.retries(2)
.store( (data) => {
  console.log(data);
  //commands to save the data to your database
})
.setInterval(5000)
.run()

