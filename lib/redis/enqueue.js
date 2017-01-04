/**
* @description Becomes public method after setRedis is called. Adds jobs to Redis queue.
* @param {Object} siphonObject - Carries 'this' reference from setRedis
* @param {Object} redisClient - Perform Redis CLI commands with client from setRedis
* @param {Object} cluster - Gives access to Node cluster module from setRedis
* @return {Object} The siphon object for method chaining
*/
function enqueue(siphonObject, redisClient, cluster) {
  if (cluster.isMaster) {
    const job = JSON.stringify(siphonObject, replacer, 2);
    redisClient.lpush(['jobsQueue', job], (err, reply) => {
      if (err) throw new Error(err);
      console.log(`jobsQueue now contains ${reply} jobs`);
    });
  }

  return siphonObject;
}

/**
* @description Used as JSON.stringify parameter to only stringify properties necessary for execution on remote server.
* @param {String} key - If replacer finds object or array, this represents each key
* @param {Any} value - If replacer finds object or array, this represents each value
* @return {Any} Replaces old value. If falsy, removes old value.
*/
function replacer(key, value) {
  const omittedProperties = {
    client: 'instant lookup',
    execute: 'instant lookup',
    executeSelenium: 'instant lookup',
    get: 'instant lookup',
    giveWorker: 'instant lookup',
    find: 'instant lookup',
    idle: 'instant lookup',
    notify: 'instant lookup',
    retries: 'instant lookup',
    run: 'instant lookup',
    selenium: 'instant lookup',
    setHeaders: 'instant lookup',
    setInterval: 'instant lookup',
    setProxies: 'instant lookup',
    setWorkers: 'instant lookup',
  };

  if (omittedProperties.hasOwnProperty(key)) return;
  if (value instanceof RegExp) return "__REGEXP " + value.toString();
  if (value instanceof Function) return value.toString();
  return value;
}

module.exports = enqueue;