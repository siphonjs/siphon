
const methods = require('./Methods');

//creates siphon object. properties added by methods include: request, html, links, data, success, error, search

function siphon() {
  return Object.assign({
    createdAt: null,
    stage: null,
    tries: 1,

  }, methods, ,);

}

module.exports = siphon;