const methods = require('./Methods');
const request = require('request');
const setRedis = require('./SetRedis');

/**
* @description Creates siphon object. Properties added by methods include request, html, links, data, success, error, search
* @return {Object} The siphon object
*/
function siphon() {
  return Object.assign({}, {
    numWorkers: 1,
    createdAt: null,
    stage: null,
    tries: 1,
    searchTerms: [],
    urlArray: []
  }, methods, setRedis);
}

module.exports = siphon;
