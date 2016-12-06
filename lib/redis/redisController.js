const redis = require('redis');
const cluster = require('cluster');

function connectRedis(port, ip, password) {
  if(cluster.isMaster) {
    this.client = redis.createClient(port, ip);
    if(password) this.client.auth(password);
    this.client.on('connect', () => console.log('Connected to redis server'));
    this.client.on("error", (err) => console.log("Error connecting to redis server " + err));
  }

  this.enqueue = function() {
    if(cluster.isMaster) {
      const job = JSON.stringify( this, replacer, 2 );
      // Insert job into Redis queue titled 'jobsQueue'
      this.client.lpush(['jobsQueue', job], (err, reply) => {
        if (err) throw err;
      });
    }
    return this;
  }
  this.dequeue = function () {
    if(cluster.isMaster) {
      this.client.rpop('jobsQueue', (err, reply) => {
        if (err) throw err;
        const urls = reply === null ? [] : JSON.parse(reply).urlArray;
        this.setURLs(urls);
        console.log(this.urlArray);
      });
    }
    return this;
  }
  return this;
}

module.exports = connectRedis;


function replacer(key, value) {
  if (value instanceof RegExp)
    return ("__REGEXP " + value.toString());
  else if(value instanceof Function)
    return;
  else if(key === 'client')
    return;
  else if(key === 'idle')
    return;
  else
    return value;
}