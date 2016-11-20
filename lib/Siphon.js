
const methods = require('./Methods');
const request = require('request');

//creates siphon object. properties added by methods include: request, html, links, data, success, error, search

function siphon() {
  return Object.assign({
    createdAt: null,
    stage: null,
    tries: 1,
    searchTerms: [],
    data: []

  }, methods);

}

module.exports = siphon;