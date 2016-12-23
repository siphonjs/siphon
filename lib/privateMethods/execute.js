const request = require('request');
const executeSelenium = require('./executeSelenium');

/**
* @description Executes data extraction in Node workers based on Siphon Object values
* @return {Object} The siphon object to allow method chaining
*/
const execute = () => {
  const workerURL = this.workerURL;

  // Applies Selenium callback if provided
  if (this.seleniumOptions) {
    executeSelenium(this.seleniumOptions, workerURL);
    return this;
  }

  // Build up options object for GET request using request module
  let requestOptions = { url: workerURL };

  // Assign headers if provided
  if (this.headers) {
    requestOptions = Object.assign(requestOptions, { headers: this.headers });
  }

  // Rotate proxies if provided
  if (this.proxies && this.proxies[0]) {
    curProxy = this.proxies[Math.floor(Math.random() * this.proxies.length)]
    requestOptions = Object.assign(requestOptions, { proxy: curProxy });
  }
  
  // Send GET request with options we just built up
  request(requestOptions, (err, response, html) => {
    if (err) {
      return process.send({
        type: 'error',
        error: {
          description: 'Error with HTTP request',
          error: err,
          url: workerURL,
        }
      });
    };

    // If user wishes to process entire HTML page directly, apply callback then send processed data to master
    if (this.html) {
      process.send({
        type: 'data',
        data: {
          data: this.html(html, response),
          url: workerURL,
        }
      });

      return this;
    }

    // If user employs find method instead of processHTML, store regex matches
    const matchArray = [];
    this.searchTerms.forEach(regex => {
      const matches = html.match(regex);
      if (matches) {
        delete matches.index;
        delete matches.input;
        matchArray.push(matches);
      } else {
        matchArray.push('no matches for regex: ' + regex.toString());
      }

      // Send regex matches to the master
      process.send({
        type: 'data',
        data: {
          data: matchArray,
          url: workerURL,
        }
      });
    });

    return this;
  });
}

module.exports = execute;