const redis = require('redis');
const cluster = require('cluster');

function connectRedis(port, ip, password) {
  if(!cluster.isWorker) {
    this.client = redis.createClient(port, ip);
    if(password) this.client.auth(password);
    this.client.on('connect', () => console.log('Connected to redis server'));
    this.client.on("error", (err) => console.log("Error connecting to redis server " + err));
  }

  this.enqueue = function() {
    if(!cluster.isWorker) {
      const job = JSON.stringify( this, replacer, 2 );
      // Insert job into Redis queue titled 'jobsQueue'
      this.client.lpush(['jobsQueue', job], (err, reply) => {
        if (err) throw err;
      });
    }
    return this;
  }
  this.dequeue = function () {
    if(!cluster.isWorker) {
      this.client.rpop('jobsQueue', (err, reply) => {
        if (err) throw err;
        const urls = reply === null ? [] : JSON.parse(reply).urlArray;
        this.setURLs(urls);
        console.log(this.urlArray);
      });
    }
    return this;
  }
  this.dequeueAndExecute = function() {
    if(cluster.isMaster) {
      var checkRedis = () => {
        setTimeout( () => {
          console.log('listening: ', !this.idle);
          if(this.idle) {
            this.idle = false;
            this.client.rpop('jobsQueue', (err, reply) => {
              if (err) throw err;
              const response = reply !== null? JSON.parse(reply, reviver) : { urlArray: [] };
              Object.assign(this, response);
              this.run();
            });
          }
          checkRedis()}, 1000);
      }

      checkRedis();

    } else {
      this.run();
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

function reviver(key, value) {
  if (value !== null && value.toString().indexOf("__REGEXP ") == 0) {
    var m = value.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
    return new RegExp(m[1], m[2] || "");
  } else
    return value;
}