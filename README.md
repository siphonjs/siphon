# Siphon
Siphonjs is an easy-to-use data extraction library for Nodejs designed to work at scale.

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
.notify()
.run()
```

## Advanced Usage

Extract faster with remote servers and a Redis queue! We handle horizontal scaling under the hood.

Controller:
```
const siphon = require('siphonjs');

const urls = [];
for (let i = 10000; i <= 99999; i++) {
  urls.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.notify((statusMessage, requestObject) => {
  Model.bulkCreate({ processedHtml: statusMessage.data }, (err) => {
    if (err) return handleError(err);
  });
})
.setRedis(6379, 192.168.123.456, 'password')
.enqueue()
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
- `cheerio` to search HTML with Cheerio selector library

# API

Using Siphon is simple! Chain as many methods as you'd like.

### .get

Parameter: `string OR array of strings`

Each URL represents a query.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.notify()
.run()
```

### .find

Parameter: `regular expression`

Customize your search with regex.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.notify()
.run()
```

### .notify

Parameters: `function`

Notify is used to both visualize received data and store your data in a database. 
If invoked without parameters, notify defaults to console.log with stringified data.

Here are values you may wish to grab from the status message:

```
{
  id: // unique URL string,
  errors: [],
  data: [],
}
```

Example with Sequelize's "bulk create" method to store an array of values:

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.notify((statusMessage, requestObject) => {
  Tank.bulkCreate({ processedHtml: statusMessage.data }, (err) => {
    if (err) return handleError(err);
  });
})
.run()
```

### .processHtml

Parameters: `function`

Callback receives entire HTML string. 
Add second parameter to callback if you'd like to traverse with Cheerio library.

```
siphon()
.get(urls)
.processHtml((html, cheerio) => {
  const $ = cheerio.load(html);
  const titles = $('h1').text();
  ...etc
})
.run()
```

### .retries

Parameter: `number`

If a query fails, this will allow more tries on each failed query.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.retries(5)
.notify()
.run()
```

### .run

No parameters. Simply invoke as last method to execute your search!

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.notify()
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
	data = driver.findElement({className: 'city-nav-header'}).getText();
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
.notify()
.run()
```

### .setInterval

Parameter: `number` (milliseconds)

Sets how often you would like to search again. Great for throttling calls to stay within website's limits.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.setInterval(200)
.notify()
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
.notify()
.run()
```

## Team

[![Image of Will](https://avatars0.githubusercontent.com/u/7759384?v=3&s=150)](https://github.com/willbach)
[![Image of George](https://avatars3.githubusercontent.com/u/18508195?v=3&s=150)](https://github.com/ganorberg)
[![Image of Soo](https://avatars1.githubusercontent.com/u/15530782?v=3&s=150)](https://github.com/sooeung2)

## License

Released under the [MIT License](https://opensource.org/licenses/mit-license.php).


