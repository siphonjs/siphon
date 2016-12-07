const request = require('request');

/**
* @description Executes scraping in workers according to values in current siphon object
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function execute() {

  // Stores URL used in all functions to maintain proper reference to this
  const workerURL = this.workerURL;

  // Detects if user wants to use Selenium and applies custom logic
  if (this.seleniumOptions) {
    executeSelenium(this.seleniumOptions, workerURL);
    return this;
  }

  // Build up options object for GET request using request module
  let requestOptions = { url: workerURL };

  // Detect if user wants to include headers or authorization information
  if (this.headers) requestOptions = Object.assign(requestOptions, { headers: this.headers });
  if (this.auth) requestOptions = Object.assign(requestOptions, { auth: this.auth });

  // Detect if user wants to use proxies and add random proxy to options
  if (this.proxies && this.proxies[0]) {
    curProxy = this.proxies[Math.floor(Math.random() * this.proxies.length)]
    requestOptions = Object.assign(requestOptions, { proxy: curProxy });
  }
  
  // Make GET request with user's options
  request(requestOptions, (err, response, html) => {
    if (err) {
      return process.send({
        type: 'error',
        error: { description: 'error with http request', error: err, url: workerURL }
      });
    };

    // Run cheerio if exists and do not proceed to regex
    if (this.cheerio) {
      executeCheerio(html, workerURL);
      return this;
    }

    // Push the searchTerm matches in the html to the data array
    this.searchTerms.forEach(regex => {
      const matches = html.match(regex);
      if (matches) {
        delete matches.index;
        delete matches.input;
        // typeof this.storeFunction === 'string' ? eval(this.storeFunction.replace(/^.*\(.*\)/, '(matches)' )) : this.storeFunction(matches);

        if (this.storeFunction) this.storeFunction(matches);

        process.send({
          type: 'data',
          data: { data: matches, url: workerURL }
        });
      } else {
        process.send({
          type: 'error',
          error: { description: 'no matches for that regex and url', error: `the search term of: ${ele} did not have any matches`, url: workerURL }
        });
      }
    });

    return this;
  });
}

function executeSelenium(seleniumOptions, workerURL) {
  const webdriver = require('selenium-webdriver');
  const driver = new webdriver.Builder().forBrowser(seleniumOptions.browser).build();
  driver.get(workerURL);
  
  seleniumOptions.callback(driver)
  .then((data, err) => {
    if (err) {
      return process.send({
        type: 'error',
        error: {description: 'selenium connection error', error: err, url: workerURL}
      });
    }

    // Stores data in database according to user's custom callback from "store" method
    process.send({
      type: 'data',
      data: { data, url: workerURL }
    });
  }); // TODO: need catch
}

function executeCheerio(html, workerURL) {
  this.cheerio(html);
  process.send({
    type: 'data',
    data: { data: 'Cheerio callback executed', url: workerURL }
  });
}