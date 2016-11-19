

const get = require('./methods/get');
const post = require('./methods/post');
const setHeaders = require('./methods/setHeaders');
const find = require('./methods/find');
const retries = require('./methods/retries');
const store = require('./methods/store');
const push = require('./methods/push');
const execute = require('./methods/execute');


var methods = { get, post, setHeaders, find, retries, store, push, execute }

module.exports = methods;