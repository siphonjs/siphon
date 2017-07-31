[![Build Status](https://travis-ci.org/siphonjs/siphon.svg?branch=master)](https://travis-ci.org/siphonjs/siphon)
[![NPM Version](https://img.shields.io/npm/v/siphonjs.svg)](https://www.npmjs.com/package/siphonjs)
[![License](https://img.shields.io/npm/l/siphonjs.svg)](https://www.npmjs.com/package/siphonjs)


# Siphon
Siphonjs is a powerful, lightweight data extraction library for Node.js designed to work at scale.

## Features

- Intuitive chainable API
- Fault tolerant with retries and advanced error handling
- Proxies automatically rotated to enable higher volume searches 
- Clustered Node.js servers for improved server-side performance
- Custom runtime intervals for throttling to match site limits
- Pre-configured Selenium Web Driver for advanced DOM manipulation
- Pre-configured Redis access for scaling to multiple servers
- Lightweight with no large required dependencies

## Install
```
$ npm install --save siphonjs
```

## Usage

Collect 1000 temperatures in a matter of seconds!

```
const siphon = require('siphonjs');

const urls = [];
for (let i = 90025; i < 91025; i++) {
  urls.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.run()
```

## Advanced Usage

Extract faster with remote servers and a Redis queue! We handle horizontal scaling under the hood.

Controller:
```
const siphon = require('siphonjs');
const request = require('request');

// Search 100,000 weather urls in batches of 100
const INCREMENT = 100;

const siph = siphon()
.setRedis('PORT', 'IP', 'PASSWORD')
.processHtml((html, res) => {
  let temp = html.match(/[0-9]{2}\.[0-9]/);
  if (!temp) return { zip: null };
  else temp = temp[0];
  if (temp === '10.4') return { zip: null }
  let zip = res.req.path.match(/[0-9]{5}/);
  if (zip !== null) zip = zip[0];
  return { zip, temp };
})
.notify((statMsg) => {
  console.log(statMsg);
  request.post(*your url here*, {
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(statMsg)
  });
});

for (let i = 00000; i < 99999; i += INCREMENT) {
  const urls = [];
  for (let j = 0; j < INCREMENT; j++) {
    let num = (i + j).toString();
    while (num.length < 5) {
      num = '0' + num;
    }
    
    urls.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${num}`);
  }
  
  siph.get(urls).enqueue()
}
```

Workers:
```
const siphon = require('siphonjs');

siphon()
.setRedis(6379, 192.168.123.456, 'password')
.run()
```

## Required Dependencies

- `request` for http request handling

## Optional Dependencies

- `redis` for parallel processing with multiple servers
- `selenium-webdriver` for jobs requiring full client-side rendering

## Testing Dependencies

Simply run "npm test" in your terminal to execute all tests!

- `mocha` test runner
- `chai` assertion library

# API

Using Siphon is simple! Chain as many methods as you'd like.

### .find

Parameter: `regular expression`

Customize your search with regex.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.run()
```

### .get

Parameter: `string OR array of strings`

Each URL represents a query.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.run()
```

### .notify

Parameter: `function`

Notify is used to both visualize received data and store your data in a database. 
If invoked without parameters, this method defaults to console.log with stringified data.

Here is the structure of the status message:

```
{
  id: // unique URL string,
  errors: [],
  data: [],
}
```

Here is an example with Sequelize's "bulk create" method to store your data:

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.notify((statusMessage) => {
  Tank.bulkCreate({ processedHtml: statusMessage.data }, (err) => {
    if (err) return handleError(err);
  });
})
.run()
```

### .processHtml

Parameter: `function`

Callback receives entire HTML string. 

```
siphon()
.get(urls)
.processHtml((html) => {
  console.log(html);
})
.run()
```

### .retries

Parameter: `number`

If a query fails, this allows more tries on each failed query.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.retries(5)
.run()
```

### .run

No parameters. Simply invoke as last method to execute your search on that server!

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.run()
```

### .selenium

Parameter: `function`

If you wish to use the power of the Selenium Web Driver, insert all Selenium logic inside of this callback.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.selenium('chrome', (driver) => {
	data = driver.findElement({className: 'class-name'}).getText();
	driver.quit();
	return data;
})
.run()
```

### .setHeaders

Parameter: `object`

Provide headers for GET requests.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.setHeaders({ 'User-Agent': 'George Soowill' })
.run()
```

### .setInterval

Parameter: `number` (milliseconds)

Sets how often you would like to search again. Great for throttling calls to stay within a website's request limits.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.setInterval(200)
.run()
```

### .setProxies

Parameter: `array of strings`

If you provide more than one proxy, we automatically rotate through them for you!

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.setProxies(['192.168.1.2', '123.456.7.8'])
.run()
```

## .setRedis

Parameters: `string (PORT), string (Redis IP Address), string (password if applicable)`

Use a Redis queue to store your queries for later execution. Makes Redis methods below public (enqueue, flush, length, range). 
Siphon will automatically configure the 'jobsQueue' list for you. Defaults to your computer's client if no parameters provided.

Single Computer:

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.setRedis()
.enqueue()
.run()
```

Remote Redis server with worker cluster:

Controller:
```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.setRedis('6379', '188.78.58.162', 'siphontestingnodejs')
.enqueue()
```

Workers:
```
siphon()
.setRedis('6379', '188.78.58.162', 'siphontestingnodejs')
.run()
```

### .enqueue

Private until .setRedis method is called. No parameters. Stores queries in your Redis server.

```
siphon()
.get(urls)
.setRedis()
.enqueue()
```

### .flush

Private until .setRedis method is called. No parameters. Empties Redis server.

```
siphon()
.setRedis()
.flush()
```

### .length

Private until .setRedis method is called. No parameters. Gives length of jobs queue.

```
siphon()
.setRedis('6379', '188.78.58.162', 'siphontestingnodejs')
.length()
```

### .range

Private until .setRedis method is called. No parameters. Provides list of all jobs in queue.

```
siphon()
.setRedis('6379', '188.78.58.162', 'siphontestingnodejs')
.range()
```

## Team

[![Image of Will](https://avatars0.githubusercontent.com/u/7759384?v=3&s=150)](https://github.com/willbach)
[![Image of George](https://avatars3.githubusercontent.com/u/18508195?v=3&s=150)](https://github.com/ganorberg)
[![Image of Soo](https://avatars1.githubusercontent.com/u/15530782?v=3&s=150)](https://github.com/sooeung2)

## License

Released under the [MIT License](https://opensource.org/licenses/mit-license.php).
