# Siphon
Siphonjs is an easy-to-use data extraction library for Nodejs designed to work at scale.

## Features

- Intuitive chainable API
- Rotating proxies to enable higher volume searches 
- Clustered servers for improved performance and error handling
- Regex-enabled for specific searching
- Custom number of retries
- Custom runtime intervals
- Direct database storage
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

## Required Dependencies

- `request` for http request handling

## Optional Dependencies

- `redis` for parallel processing with multiple servers
- `selenium-webdriver` for jobs requiring full client-side rendering

# API

Using Siphon is simple! Require, invoke, then chain as many methods as you'd like. Always include .get() and end with .run().

### .cheerio

Parameter: `function`

Callback for all cheerio logic. We expose HTML string.

```
siphon()
.get(urls)
.cheerio((html) => {
  const $ = cheerio.load(html);
  const titles = $('h1').text();
  ...etc
})
.run()
```

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

Parameter: `function`

To visualize received data. Defaults to console.log with stringified data.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
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

### .store

Parameter: `function`

Use a callback to insert data into your database.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.store((data) => {
  Tank.create({ html: data }, (err) => {
    if (err) return handleError(err);
  });
})
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

### .setInterval

Parameter: `number` (seconds)

Sets how often you would like to search again.

```
siphon()
.get(urls)
.find(/[0-9]{2}\.[0-9]/)
.setInterval(5000)
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
.selenium('chrome', (data) => console.log(data))
.run()
```

## Team

[![Image of Will](https://avatars0.githubusercontent.com/u/7759384?v=3&s=150)](https://github.com/willbach)
[![Image of George](https://avatars3.githubusercontent.com/u/18508195?v=3&s=150)](https://github.com/ganorberg)
[![Image of Soo](https://avatars1.githubusercontent.com/u/15530782?v=3&s=150)](https://github.com/sooeung2)

## License

Released under the [MIT License](https://opensource.org/licenses/mit-license.php).


