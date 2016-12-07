const cheerio = require('./methods/cheerio');
const execute = require('./methods/execute');
const find = require('./methods/find');
const get = require('./methods/get');
const giveWorker = require('./methods/giveWorker');
const notify = require('./methods/notify');
const retries = require('./methods/retries');
const run = require('./methods/run');
const selenium = require('./methods/selenium');
const setHeaders = require('./methods/setHeaders');
const setProxies = require('./methods/setProxies');
const setWorkers = require('./methods/setWorkers');
const setInterval = require('./methods/setInterval');
const setAuth = require('./methods/setAuth');
const store = require('./methods/store');
const post = require('./methods/post');

module.exports = {
  cheerio,
  execute,
  find,
  get,
  giveWorker,
  notify,
  retries,
  run,
  selenium,
  setHeaders,
  setProxies,
  setWorkers,
  setInterval,
  setAuth,
  store,
  post,
};
