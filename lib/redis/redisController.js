const redis = require('redis');
const client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});

client.on("error", function (err) {
  console.log("Error " + err);
});

let red = {
  enqueue: function(siphonObject) {
    
    // Customized stringify to include functions
    const job = JSON.stringify(siphonObject, (key, val) => {
      if (typeof val === 'function') return val.toString();
      return val;
    })
    
    // Insert job into Redis queue titled 'jobsQueue'
    return client.lpush(['jobsQueue', job], (err, reply) => {
      if (err) throw err;
    });
  },

  // Remove job from Redis queue and apply callback to handle job in Masters
  dequeueToMaster: function (callback) {
    return client.rpop('jobsQueue', (err, reply) => {
      if (err) throw err;
      callback(reply);
    });
  },
};

module.exports = red;