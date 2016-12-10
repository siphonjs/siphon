const cheerio = require('./publicMethods/cheerio');
const execute = require('./privateMethods/execute');
const find = require('./publicMethods/find');
const get = require('./publicMethods/get');
const giveWorker = require('./privateMethods/giveWorker');
const notify = require('./publicMethods/notify');
const retries = require('./publicMethods/retries');
const run = require('./publicMethods/run');
const selenium = require('./publicMethods/selenium');
const setHeaders = require('./publicMethods/setHeaders');
const setProxies = require('./publicMethods/setProxies');
const setWorkers = require('./publicMethods/setWorkers');
const setInterval = require('./publicMethods/setInterval');
const store = require('./publicMethods/store');

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
  store,
};
