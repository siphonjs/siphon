const methods = require('./Methods');
const request = require('request');
const setRedis = require('./SetRedis');

/**
* @description Creates siphon object. Properties added by methods.
* @return {Object} The siphon object
*/
function siphon() {
  return Object.assign({}, {
    urls: [],
    searchTerms: [],
    numWorkers: 1,
    tries: 1,
    idle: true,
    initial: true,
  }, methods, setRedis);
}

module.exports = siphon;
