const cluster = require('cluster');

module.exports = function run () {
  if(cluster.isMaster) {
    //initiate object to store all uncompleted jobs, errors, and data
    const returnMessage = {
      jobs: {},
      errors: [],
      data: [],
      jobCount: this.urlArray.length
    }
    

    //set up workers function
    //includes logic to handle messages coming from workers
    function createWorker() {
      console.log('Creating a new worker')
      let worker = cluster.fork();
      worker.on('message', (message) => {
        if(message.type === 'data') {
          console.log('message data ', message.data)
          if(returnMessage.jobs[message.url]) {
            returnMessage.data.push(message.data);
            delete returnMessage.jobs[message.url];
            returnMessage.jobCount--;
          }
        }
        if(message.type === 'error') {
          console.log('error message ', message.error);
          returnMessage.errors.push(message.error);
          returnMessage.jobCount--;
        }
        if(returnMessage.jobCount === 0) {
          console.log('shutting down workers and sending returnMessage');
          var wid, workerIds = [];
          for(wid in cluster.workers) {
            workerIds.push(wid);
          }
          for(let wid in workerIds) {
            console.log('current worker is ', wid)
            cluster.workers[workerIds[wid]].send({
              type: 'shutdown',
              from: 'master'
            })
          }
          console.log(returnMessage.data);
        }
      });
    }
    //initiate the cluster
    console.log('Master cluster setting up ' + this.numWorkers + ' workers');
    for(let i = 0; i < this.numWorkers; i++) {
      createWorker();
    }
    cluster.on('online', function(worker) {
      console.log('Worker ' + worker.process.pid + ' is online');
    });
    //restart workers on exit event (except for deliberate shutdown)
    cluster.on('exit', function(worker, code, signal) {
      if(code !== 0) {
        console.log(`Worker ${worker.process.pid} died with code: ${code}`);
        createWorker();
        console.log('Started a new worker');
      }
    });
    //create array of worker IDs to assign jobs and shut down workers
    var wid, workerIds = [];
      for(wid in cluster.workers) {
        workerIds.push(wid);
      }
    //assign jobs
      var assignJobs = (urlArray) => {
      while(urlArray[0] !== undefined) {
        for(let j = 0; j < this.numWorkers && urlArray[0] !== undefined; j++) {
          let currentJob = urlArray.pop();
          //put current job in the jobs array for tracking
          returnMessage.jobs[currentJob] = 1;
          console.log(currentJob);
          cluster.workers[workerIds[j]].send({
            type: 'execute',
            url: currentJob,
            from: 'master'
          })
        }
      }
    }
    //initiate loop
    assignJobs(this.urlArray);

  } else {
    process.on('message', (message) => {
      if(message.type === 'execute') {
        // console.log('here is the url', message.url);
        this.get(message.url).execute();
      }
      if(message.type === 'shutdown') {
        console.log('shutting down');
        process.exit(0);
      }
    })
  }

  var wid, workerIds = [];

  for(wid in cluster.workers) {
    workerIds.push(wid);
  }
}