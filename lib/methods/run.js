const cluster = require('cluster');

module.exports = function run () {
  if(cluster.isMaster) {
    //initiate object to store all uncompleted jobs, errors, and data
    var finished = false;
    const returnMessage = {
      jobs: {},
      errors: [],
      data: [],
      jobCount: this.urlArray.length
    }
    //set up workers function
    //includes logic to handle messages coming from workers
    var createWorker = () => {
      console.log('Creating a new worker')
      let worker = cluster.fork();
      worker.on('message', (message) => {
        if(message.type === 'data' && returnMessage.jobs[message.url] !== undefined) {
          console.log('message data ', message.data)
          returnMessage.data.push({ 'data': message.data, 'url': message.url });
          delete returnMessage.jobs[message.url];
          console.log(returnMessage.jobCount--);
        }
        if(message.type === 'error' && returnMessage.jobs[message.url] !== undefined) {
          returnMessage.jobs[message.url]--;
          console.log('error message ', message.error);
          //if job has no ties left push it to array and delete the job
          if(returnMessage.jobs[message.url] === 0) {
            returnMessage.errors.push(message.error);
            delete returnMessage.jobs[message.url];
            console.log(returnMessage.jobCount--);
          }
        }
        if(returnMessage.jobCount === 0) {
          finished = true;
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
          this.storeFunction(returnMessage);
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

    //assign jobs
    var assignJobs = (urlArray) => {
      while(urlArray[0] !== undefined) {
        for(let j = 0; j < this.numWorkers && urlArray[0] !== undefined; j++) {
          let currentJob = urlArray.pop();
          //put current job in the jobs array for tracking
          returnMessage.jobs[currentJob] = this.tries;
          Object.keys(cluster.workers).forEach( (worker) => {
            cluster.workers[worker].send({
              type: 'execute',
              url: currentJob,
              from: 'master'
            })
          })
        }
      }
    }
    //initiate loop
    assignJobs(this.urlArray);

    //assign all outstanding jobs to the workers on an interval
    var checkJobs = () => {
      console.log('about to loop');
      if(Object.keys(returnMessage.jobs).length > 0) {
        console.log('looping for jobs');
        setTimeout(() => {
          assignJobs(Object.keys(returnMessage.jobs));
          checkJobs();
        }, 3000);
      } else {
        return;
      }
    }
    checkJobs();

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
}