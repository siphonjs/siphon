# Siphon
Siphonjs is an easy-to-use data extraction library for Nodejs designed to work at scale.

Features include:
- Only one dependency: the 'request' module
- Rotating proxies to enable higher volume searches 
- Clustered servers for improved performance and error handling
- Optional dependency: selenium-webdriver for jobs requiring full client-side rendering
- Optional dependency: Redis to create a large queue connected to multiple servers

# Install
```
$ npm install --save siphonjs
```

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




