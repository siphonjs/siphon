const redis = require('redis');
const client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});

client.on("error", function (err) {
  console.log("Error " + err);
});

let red = {
  enqueue: function(jobURL) {
    return client.lpush(['jobsQueue', jobURL], function (err, reply) {
      if (err) throw err;
      console.log(reply);
    });
  },

  checkQueueLength: function () {
    return client.lrange('jobsQueue', 0, -1, function(err, reply) {
      if (err) throw err;
      console.log(reply);
    });
  },

  rpoplpush: function (redisList, callback) {
    return client.rpop(redisList, function (err, reply) {
      if (err) throw err;
      callback(reply);
    });
  },
};

module.exports = red;