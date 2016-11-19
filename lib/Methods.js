

const get = require('./get');
const post = require('./post');
const headers = require('./headers');
const find = require('./find');
const retries = require('./retries');
const save = require('./save');
const push = require('./push');
const execute = require('./execute');


var methods = { get, post, headers, find, retries, save, push, execute }

module.exports = methods;