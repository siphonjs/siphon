const request = require('request');

module.exports = function execute () {
  var curURL = this.url;
  if (this.seleniumOptions) {
    const webdriver = require('selenium-webdriver');
    const driver = new webdriver.Builder().forBrowser(this.seleniumOptions.browser).build();
    driver.get(curURL);
    this.seleniumOptions.callback(driver)
    .then((data, err) => {
      if(err) {
        process.send({
          type: 'error',
          error: err,
          url: curURL
        })
        return;
      } else {
        this.storeFunction(data);
        process.send({
          type: 'data',
          data: data,
          url: curURL
        })
      }
    });
    return;
  }
  var requestOptions = {url: curURL};
  if(this.proxies !== undefined && this.proxies[0] !== undefined) {
    console.log('we have a proxy', this.proxies[0]);
    var curProxy = this.proxies[Math.floor(Math.random() * this.proxies.length)]
    requestOptions = Object.assign(requestOptions, {proxy: curProxy});
  }
  if(this.headers) requestOptions = Object.assign(requestOptions, {headers: this.headers});
  if(this.auth) requestOptions = Object.assign(requestOptions, {auth: this.auth})
  request(requestOptions, (err, response, body) => {
    if(err) {
      process.send({
        type: 'error',
        error: err,
        url: curURL
      })
      return;
    }
    //push the searchTerm matches in the html to the data array
    this.searchTerms.forEach( (ele) => {
      var matches = body.match(ele);
      delete matches.index;
      delete matches.input;
      this.storeFunction(matches);
      process.send({
        type: 'data',
        data: matches,
        url: curURL,
        proxy: curProxy
      })
    });
    return this;
  })
}
