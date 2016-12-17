const request = require('request');
const executeSelenium = require('./executeSelenium');

/**
* @description Executes scraping in workers according to values in current siphon object
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function execute() {
  const workerURL = this.workerURL;

  

  // Detects if user wants to use Selenium and applies custom logic
  if (this.seleniumOptions) {
    executeSelenium(this.seleniumOptions, workerURL, this.storeFunction);
    return this;
  }

  // Build up options object for GET request using request module
  let requestOptions = { url: workerURL };
  if (this.headers) {
    requestOptions = Object.assign(requestOptions, { headers: this.headers });
  }

  // Rotate proxies
  if (this.proxies && this.proxies[0]) {
    curProxy = this.proxies[Math.floor(Math.random() * this.proxies.length)]
    requestOptions = Object.assign(requestOptions, { proxy: curProxy });
  }
  
  request(requestOptions, (err, response, html) => {
    if (err) {
      return process.send({
        type: 'error',
        error: { description: 'error with http request', error: err, url: workerURL }
      });
    };

    // Run cheerio if exists and do not proceed to regex
    if (this.html) {

      process.send({
        type: 'data',
        data: { data: this.html(html, response), url: workerURL }
      });
      return this;
    }

    // Push the searchTerm matches in the html to the data array
    const matchArray = [];
    this.searchTerms.forEach(regex => {
      const matches = html.match(regex);
      if (matches) {
        if (this.storeFunction) this.storeFunction(matches, workerURL);
        delete matches.index;
        delete matches.input;
        matchArray.push(matches);
        
      } else {
        process.send({
          type: 'error',
          error: { description: 'no matches for that regex and url', error: `the search term of: ${regex} did not have any matches`, url: workerURL }
        });
      }
      process.send({
        type: 'data',
        data: { data: matchArray, url: workerURL }
      });
    });

    return this;
  });
}