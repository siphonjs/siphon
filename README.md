# Siphon
Siphonjs is an easy-to-use data extraction library for Nodejs that is designed to work at scale by making use of Node's built-in clustering behavior by default. Siphon can make use of proxies to enable a higher volume of data extraction/web scraping. Siphon has also been set up to work on a cluster of servers with a Redis queue handling job assignment. Siphon requires the 'request' module as a dependency, and there are optional dependecies of selenium-webdriver and cheerio for jobs requiring DOM actions and full client-side rendering.

# Install
$ npm install --save siphonjs

# Usage

Collect 1000 temperatures in a matter of seconds!

```
const siphon = require('siphonjs');

const urls = [];

for(let i = 90025; i < 91025; i++) {
  urls.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

siphon()
.setURLs(urls)
.find(/[0-9]{2}\.[0-9]/)
.run()
```

# API

# Team

# License




