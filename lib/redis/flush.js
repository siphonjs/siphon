/**
* @description Becomes public method after setRedis is called. Empties jobsQueue list.
* @param {Object} siphonObject - Carries 'this' reference from setRedis
* @param {Object} redisClient - Perform Redis CLI commands with client from setRedis
* @param {Object} cluster - Gives access to Node cluster module from setRedis
* @return {Object} The siphon object for method chaining
*/
function flush(siphonObject, redisClient, cluster) {
  if (cluster.isMaster) {
    redisClient.flushdb((err, reply) => {
      if (err) throw new Error(err);
      console.log(`jobsQueue is flushed`);
    });
  }

  return siphonObject;
}

module.exports = flush;