const redis = require('redis');
const cluster = require('cluster');

/**
* @description Connects to Redis server, then allows access to queue methods.
* @param {Number} port - Remote Redis server's port
* @param {Number} ip - Remote Redis server's IP address
* @param {String} password - Remote Redis server's password (if applicable)
* @return {Object} The siphon object to allow method chaining
*/
function connectRedis(port, ip, password) {
  if (cluster.isMaster) {

    // Remote connection
    if (port && ip) this.client = redis.createClient(port, ip);
    if (password) this.client.auth(password);

    // Local connection if not interested in remote connection
    this.client = redis.createClient();

    // Debugging listeners
    this.client.on('connect', () => console.log('Connected to redis server'));
    this.client.on("error", (err) => console.log("Error connecting to redis server " + err));
  }

  /**
  * @description Adds job to Redis queue.
  * @return {Object} The siphon object for method chaining
  */
  this.enqueue = function() {
    if (cluster.isMaster) {
      const job = JSON.stringify(this, replacer, 2);
      
      // Insert job into Redis queue titled 'jobsQueue'
      this.client.lpush(['jobsQueue', job], (err, reply) => {
        if (err) throw err;
      });
    }

    return this;
  }

  /**
  * @description Removes job from Redis queue.
  * @return {Object} The siphon object for method chaining
  */
  this.dequeue = function () {
    if (cluster.isMaster) {
      this.client.rpop('jobsQueue', (err, reply) => {
        if (err) throw err;
        const urls = reply ? JSON.parse(reply).urlArray : [];
        this.setURLs(urls);
        console.log(this.urlArray);
      });
    }
    
    return this;
  }

  /**
  * @description Transfers jobs to workers.
  * @return {Object} The siphon object for method chaining
  */
  this.dequeueAndExecute = function() {
    if (cluster.isMaster) {

      // Arrow functions maintain 'this' reference
      const checkRedis = () => {
        setTimeout( () => {
          console.log('listening: ', !this.idle);
          if (this.idle) {
            this.idle = false;
            this.client.rpop('jobsQueue', (err, reply) => {
              if (err) throw err;
              const response = reply ? JSON.parse(reply, reviver) : { urlArray: [] };
              Object.assign(this, response);
              this.run();
            });
          }

          // Recursively call function to continue checks every second
          checkRedis()}, 1000);
      }

      // Initiate checking
      checkRedis();

    // Workers should run code instead of checking Redis queue
    } else {
      this.run();
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
  if (key === 'client' || key === 'idle') return;
  return value instanceof RegExp ? "__REGEXP " + value.toString() : value;
}

/**
* @description Used as JSON.parse parameter to convert regexString to regex.
* @param {String} key - If reviver finds object or array, this represents each key
* @param {Any} value - If reviver finds object or array, this represents each value
* @return {Regular Expression} Regex transferred through JSON
*/
function reviver(key, value) {
  if (value && value.toString().includes("__REGEXP ")) {
    var m = value.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
    return new RegExp(m[1], m[2] || "");
  }
  
  return value;
}

module.exports = connectRedis;