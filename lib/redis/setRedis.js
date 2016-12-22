const redis = require('redis');
const cluster = require('cluster');

/**
* @description Connects to Redis server, then allows access to queue methods.
* @param {Number} port - Remote Redis server's port
* @param {Number} ip - Remote Redis server's IP address
* @param {String} password - Remote Redis server's password (if applicable)
* @return {Object} The siphon object to allow method chaining
*/
function setRedis(port, ip, password) {
  if (cluster.isMaster) {

    // Remote connection
    if (port && ip) {
      this.client = redis.createClient(port, ip);
      if (password) this.client.auth(password);
    } else {

      // Local connection if not interested in remote connection
      this.client = redis.createClient();
    }

    // Debugging listeners
    this.client.on('connect', () => console.log('Connected to redis server'));
    this.client.on("error", (err) => console.log("Error connecting to redis server " + err));
  }

  /**
  * @description Becomes public method after setRedis is called. Adds jobs to Redis queue.
  * @return {Object} The siphon object for method chaining
  */
  this.enqueue = function() {
    if (cluster.isMaster) {
      const job = JSON.stringify(this, replacer, 2);
      // Insert job into Redis queue titled 'jobs'
      this.client.lpush(['jobsQueue', job], (err, reply) => {
        if (err) throw err;
        console.log('jobs queue length is ' + reply);
      });
    }

    return this;
  }

  return this;
}

/**
* @description Used as JSON.stringify parameter to transfer regex and avoid Redis setup info.
* @param {String} key - If replacer finds object or array, this represents each key
* @param {Any} value - If replacer finds object or array, this represents each value
* @return {Any} Replaces old value. If falsy, removes old value.
*/
function replacer(key, value) {
  let omitted = ['client', 'idle', 'selenium', 'get', 'find', 'retries', 'run', 'setHeaders', 'setInterval', 'setProxies',
   'setWorkers', 'notify', 'store', 'idle', 'run', 'execute', 'executeSelenium', 'giveWorker', 'storeFunction'];

  if (omitted.includes(key)) return;

  if (value instanceof RegExp) {
    return "__REGEXP " + value.toString();
  } else if ( value instanceof Function ) {
    return value.toString();
  } else {
    return value;
  }
}

module.exports = setRedis;
