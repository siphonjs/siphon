/**
* @description Becomes public method after setRedis is called. Gives length of jobs queue.
* @param {Object} siphonObject - Carries 'this' reference from setRedis
* @param {Object} redisClient - Perform Redis CLI commands with client from setRedis
* @param {Object} cluster - Gives access to Node cluster module from setRedis
* @return {Object} The siphon object for method chaining
*/
function length(siphonObject, redisClient, cluster) {
  if (cluster.isMaster) {
    redisClient.llen('jobsQueue', (err, reply) => {
      if (err) throw new Error(err);
      console.log(`jobsQueue length is ${reply}`);
    });
  }

  return siphonObject;
}

module.exports = length;