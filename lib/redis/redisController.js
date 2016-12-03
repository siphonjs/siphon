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
      // Customized stringify to include functions
      // const job = JSON.stringify(siphonObject, (key, val) => {
      //   if (typeof val === 'function') return val.toString();
      //   return val;
      // });

      const job = JSON.stringify({ urlArray: this.urlArray, proxies: this.proxies });
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
        console.log('trying to execute this damn function');
        setTimeout( () => {
          console.log('are we idle? ', this.idle);
          if(this.idle) {
            this.idle = false;
            this.client.rpop('jobsQueue', (err, reply) => {
              if (err) throw err;
              const urls = reply === null ? [] : JSON.parse(reply).urlArray;
              this.setURLs(urls);
              this.run();
            });
          }
          checkRedis();
        }, 1000);
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
