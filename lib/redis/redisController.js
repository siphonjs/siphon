const redis = require('redis');
const client = redis.createClient();
// const bluebird = require('bluebird');
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

client.on('connect', function() {
    console.log('connected');
});

client.on("error", function (err) {
  console.log("Error " + err);
});

let red = {
  addToQueue: function(siphonObject) {
    return client.lpush(['frameworks', 'angularjs'], function(err, reply) {
      console.log(reply); //prints 1
    });
  },

  checkQueueLength: function () {
    return client.lrange('frameworks', 0, -1, function(err, reply) {
      console.log(reply); // ['angularjs']
    });
  },

  removeFromQueue: function (list1, list2) {
    return client.rpoplpush(list1, list2)
      // .then((resp) => {
      //   if (resp === 0) throw new Error('item was not pushed to worker');
      // });
  },
};


module.exports = { red };