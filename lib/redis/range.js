/**
* @description Becomes public method after setRedis is called. Shows all items in jobsQueue.
* @param {Object} siphonObject - Carries 'this' reference from setRedis
* @param {Object} redisClient - Perform Redis CLI commands with client from setRedis
* @param {Object} cluster - Gives access to Node cluster module from setRedis
* @return {Object} The siphon object for method chaining
*/
module.exports = (siphonObject, redisClient, cluster) => {
  if (cluster.isMaster) {
    redisClient.lrange(['jobsQueue', 0, -1],  (err, reply) => {
      if (err) throw new Error(err);
      console.log(`jobsQueue contains these items: ${reply}`);
    });
  }

  return siphonObject;
}