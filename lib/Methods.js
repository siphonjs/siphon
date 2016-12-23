const execute = require('./privateMethods/execute');
const find = require('./publicMethods/find');
const get = require('./publicMethods/get');
const giveWorker = require('./privateMethods/giveWorker');
const notify = require('./publicMethods/notify');
const processHtml = require('./publicMethods/processHtml');
const retries = require('./publicMethods/retries');
const run = require('./publicMethods/run');
const selenium = require('./publicMethods/selenium');
const setHeaders = require('./publicMethods/setHeaders');
const setInterval = require('./publicMethods/setInterval');
const setProxies = require('./publicMethods/setProxies');
const setRedis = require('./redis/setRedis');
const setWorkers = require('./publicMethods/setWorkers');

module.exports = {
  execute,
  find,
  get,
  giveWorker,
  notify,
  processHtml,
  retries,
  run,
  selenium,
  setHeaders,
  setInterval,
  setProxies,
  setRedis,
  setWorkers,
};
