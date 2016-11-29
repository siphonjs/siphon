
const request = require('request');

module.exports = function execute () {
  
  var requestToExecute;
  if(this.proxy) requestToExecute = request.defaults({proxy: this.proxy});
  else requestToExecute = request.defaults();
  var curURL = this.url;
  requestToExecute.get(curURL, (err, response, body) => {
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
      console.log('sending message with ', curURL);
      process.send({
        type: 'data',
        data: matches,
        url: curURL
      })
    });
    
    return this;
  })
}


  