

const get = require('./get');
const post = require('./post');
const setHeaders = require('./setHeaders');
const find = require('./find');
const retries = require('./retries');
const store = require('./store');
const push = require('./push');
const execute = require('./execute');
const http = require('./http');


var methods = { get, post, setHeaders, find, retries, store, push, execute }

module.exports = methods;