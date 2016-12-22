const methods = require('./Methods');
const request = require('request');

/**
* @description Creates siphon object with properties added by methods.
* @return {Object} The siphon object
*/
function siphon() {
  return Object.assign({}, {
    urls: [],
    searchTerms: [],
    numWorkers: require('os').cpus().length,
    tries: 1,
    idle: true,
    initial: true,
  }, methods);
}

module.exports = siphon;
