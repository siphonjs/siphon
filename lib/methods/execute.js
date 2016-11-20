
const request = require('request');

module.exports = function execute () {

  request(this.url, (err, response, body) => {
    if(err) throw new Error('Error with http request ', err)
      //push the searchTerm matches in the html to the data array
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


  