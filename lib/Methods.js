

const get = require('./methods/get');
const post = require('./methods/post');
const setHeaders = require('./methods/setHeaders');
const find = require('./methods/find');
const retries = require('./methods/retries');
const store = require('./methods/store');
const pushTo = require('./methods/pushTo');
const execute = require('./methods/execute');
const setProxies = require('./methods/setProxies');
const setWorkers = require('./methods/setWorkers');
const setURLs = require('./methods/setURLs');
const run = require('./methods/run');
const selenium = require('./methods/selenium');

module.exports = { get, post, setHeaders, find, retries, store, pushTo, execute, setProxies, setWorkers, setURLs, run, selenium };
