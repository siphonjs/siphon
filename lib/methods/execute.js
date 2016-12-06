const request = require('request');

/**
* @description Executes scraping in workers according to values in current siphon object
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function execute() {

  // Stores URL used in all functions to maintain proper reference to this
  const curURL = this.url;

  // Detects if user wants to use Selenium and applies custom logic
  if (this.seleniumOptions) {
    const webdriver = require('selenium-webdriver');
    const driver = new webdriver.Builder().forBrowser(this.seleniumOptions.browser).build();
    driver.get(curURL);
    
    return this.seleniumOptions.callback(driver)
    .then((data, err) => {
      if (err) {
        return process.send({
          type: 'error',
          error: {description: 'selenium connection error', error: err, url: curURL}
        });
      }

      // Stores data in database according to user's custom callback from "store" method
      this.storeFunction(data); // WGS: what is format of selenium data? User needs to know ahead of time.
      process.send({
        type: 'data',
        data: {data, url: curURL}
      });
    }); // WGS: need catch? or should we eliminate promise structure in favor of nested callback?
  }

  // Build up options object for GET request using request module
  let requestOptions = { url: curURL };

  // Detect if user wants to use proxies and add random proxy to options
  if (this.proxies && this.proxies[0]) {
    console.log('we have a proxy', this.proxies[0]);
    curProxy = this.proxies[Math.floor(Math.random() * this.proxies.length)]
    requestOptions = Object.assign(requestOptions, { proxy: curProxy });
  }
  
  // Detect if user wants to include headers or authorization information
  if (this.headers) requestOptions = Object.assign(requestOptions, { headers: this.headers });
  if (this.auth) requestOptions = Object.assign(requestOptions, { auth: this.auth });
  
  // Make GET request with user's options
  request(requestOptions, (err, response, body) => {
    if (err) {
      return process.send({
        type: 'error',
        error: { description: 'error with http request', error: err, url: curURL}
      });
    };

    // Push the searchTerm matches in the html to the data array
    this.searchTerms.forEach(ele => {
      const matches = body.match(ele);
      if(matches) {
        delete matches.index;
        delete matches.input;
        // typeof this.storeFunction === 'string' ? eval(this.storeFunction.replace(/^.*\(.*\)/, '(matches)' )) : this.storeFunction(matches);
        
        this.storeFunction(matches);
        process.send({
          type: 'data',
          data: {data: matches, url: curURL}
        });
      } else {
        process.send({
          type: 'error',
          error: {description: 'no matches for that regex and url', error: `the search term of: ${ele} did not have any matches`, url: curURL}
        });
      }
      
    });

    return this;
  })
}
