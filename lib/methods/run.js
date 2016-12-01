const cluster = require('cluster');

module.exports = function run() {
  if(cluster.isMaster) {
    //initiate object to store all uncompleted jobs, errors, and data
    const statusMessage = {
      jobs: {},
      errors: [],
      data: [],
      jobCount: this.urlArray.length
    }
    //set up workers function
    //includes logic to handle messages coming from workers
    function createWorker (statMsg) {
      let worker = cluster.fork();
      worker.on('message', (message) => {
        if(message.type === 'data' && statMsg.jobs[message.url] !== undefined) {
          statMsg.data.push({ 'data': message.data, 'url': message.url });
          delete statMsg.jobs[message.url];
          console.log(--statMsg.jobCount);
        }
        if(message.type === 'error' && statMsg.jobs[message.url] !== undefined) {
          //if job has no ties left push it to array and delete the job
          if(statMsg.jobs[message.url] === 0) {
            statMsg.errors.push(message.error);
            delete statMsg.jobs[message.url];
            console.log(--statMsg.jobCount);
          }
        }
        if(statMsg.jobCount === 0) {
          Object.keys(cluster.workers).forEach( (worker) => {
            console.log('current worker is ', worker)
            cluster.workers[worker].send({
              type: 'shutdown',
              from: 'master'
            })
          })
          console.log(statMsg);
          process.exit();
        }
      });
    }
    if(this.seleniumOptions || this.interval) this.numWorkers = 1;
    //initiate the cluster
    console.log('Master cluster setting up ' + this.numWorkers + ' workers');
    for(let i = 0; i < this.numWorkers; i++) { createWorker(statusMessage) }
    cluster.on('online', function(worker) { console.log('Worker ' + worker.process.pid + ' is online') });
    //restart workers on exit event (except for deliberate shutdown)
    cluster.on('exit', function(worker, code, signal) {
      if(code !== 0) {
        // console.log(`Worker ${worker.process.pid} died with code: ${code}`);
        createWorker(statusMessage);
        console.log('Started a new worker');
      }
    });
    //assign jobs
    if(this.interval) setInterval( () => assignJobs([this.urlArray.pop()], this.retries, cluster.workers, statusMessage), this.interval);
    else assignJobs(this.urlArray, this.retries, cluster.workers)
    //assign all outstanding jobs to the workers on an interval
    checkJobs(Object.keys(statusMessage.jobs), this.retries, cluster.workers, statusMessage);
  } else {
    process.on('message', (message) => {
      if(message.type === 'execute') { if(message.url !== undefined) this.get(message.url).execute() }
      if(message.type === 'shutdown') {
        console.log('shutting down');
        process.exit(0);
      }
    })
  }
}

function checkJobs (urlArray, tries, workers, statMsg) {
  var remainingJobs = urlArray.length;
  if(remainingJobs > 0) {
    setTimeout(() => {
      assignJobs(urlArray, tries, workers, statMsg);
      checkJobs();
    }, remainingJobs > 100 ? remainingJobs * 50: 2000);
  } else { return }
}

function assignJobs (urlArray, tries, workers, statMsg) {
  while(urlArray[0] !== undefined) {
    Object.keys(workers).forEach( (worker) => {
      if(urlArray[0] !== undefined) {
        let currentJob = urlArray.pop();
        statMsg.jobs[currentJob] = tries;
        workers[worker].send({ type: 'execute', url: currentJob, from: 'master' })
      }
    })
  }
}