
const request = require('request');

module.exports = function execute () {
  
  var requestToExecute;
  if(this.proxy) requestToExecute = request.defaults({proxy: this.proxy});
  else requestToExecute = request.defaults();

  requestToExecute.get(this.url, (err, response, body) => {
    if(err) throw new Error(`Error with http request related to ${this.url}` , err)
    //push the searchTerm matches in the html to the data array
    if(this.overwrite) this.data = [];
    this.searchTerms.forEach( (ele) => {
      var matches = body.match(ele);
      delete matches.index;
      delete matches.input;
      this.data.push(matches);
    });

    //apply the store function to each item in the data array
    if(this.storeFunction) {
      this.data.forEach( (datum) => {
        this.storeFunction(datum);
      });
    }
    return this;
  })
}


  