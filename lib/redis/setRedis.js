const redis = require('redis');
const cluster = require('cluster');

// Redis methods
const enqueue = require('./enqueue');
const flush = require('./flush');
const length = require('./length');
const range = require('./range');

/**
* @description Connects to Redis server, then allows access to queue methods.
* @param {Number} port - Remote Redis server's port
* @param {Number} ip - Remote Redis server's IP address
* @param {String} password - Remote Redis server's password (if applicable)
* @return {Object} The siphon object to allow method chaining
*/
function setRedis(port, ip, password) {
  if (cluster.isMaster) {

    // Connect to Redis server
    if (port && ip) {
      this.client = redis.createClient(port, ip);
      if (password) this.client.auth(password);
    } else {
      this.client = redis.createClient();
    }

    // Debugging listeners
    this.client.on('connect', () => console.log('Connected to redis server'));
    this.client.on("error", (err) => console.log("Error connecting to redis server " + err));
  }

  this.enqueue = () => enqueue(this, this.client, cluster);
  this.flush = () => flush(this, this.client, cluster);
  this.length = () => length(this, this.client, cluster);
  this.range = () => range(this, this.client, cluster);

  return this;
}

module.exports = setRedis;
