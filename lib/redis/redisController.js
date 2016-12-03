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

      const job = JSON.stringify({ urlArray: this.urlArray, proxies: this.proxies, storeFunction: this.storeFunction.toString() });
      
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
        const urls = JSON.parse(reply).urlArray;
        this.setURLs(urls);
        console.log(urls);
      });
    }
    return this;
  }
  return this;
}

module.exports = connectRedis;
