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

const mySiphon = siphon()
  .get(urls)
  .find(/[0-9]{2}\.[0-9]/)
  .run()
```

## Required Dependencies

- `request` for http request handling

## Optional Dependencies

- `redis` for parallel processing with multiple servers
- `selenium-webdriver` for jobs requiring full client-side rendering

# API

Using Siphon is simple! Require, invoke, then chain as many methods as you'd like. The only required methods are .get, .find and .run().

### .get

Parameter: `string OR array of strings`

Each URL represents a query.

### .find

Parameter: `regular expression`

Customize your search with regex.

### .run

No parameters. Simply invoke as last method to execute your search!

### .retries

Parameter: `number`

If a query fails, this will allow more tries on each failed query.

### .store

Parameter: `function`

Use a callback to insert data into your database.

### .setProxies

Parameter: `array of strings`

If you provide more than one proxy, we automatically rotate through them for you!

### .setInterval

Parameter: `number` (seconds)

Sets how often you would like to search again. 

### .selenium

Parameter: `function`

If you wish to use the power of the Selenium Web Driver, insert all Selenium logic inside of this callback.



## Team

[![Image of Will](https://avatars0.githubusercontent.com/u/7759384?v=3&s=150)](https://github.com/willbach)
[![Image of George](https://avatars3.githubusercontent.com/u/18508195?v=3&s=150)](https://github.com/ganorberg)
[![Image of Soo](https://avatars1.githubusercontent.com/u/15530782?v=3&s=150)](https://github.com/sooeung2)

## License

Released under the [MIT License](https://opensource.org/licenses/mit-license.php).


