const cluster = require('cluster');

/**
* @description Initializes workers from master and sets logic to execute jobs
*/
module.exports = function run() {
  if (cluster.isMaster) {

    // Store all data along with any uncompleted jobs or errors
    if(!this.urlArray || !this.urlArray.length) {
      console.error('Please enter an array of urls using the "setURLs" method');
      return;
    }
    // Store all data along with any un}completed jobs or errors
    const statusMessage = {
      jobs: {},
      errors: [],
      data: [],
      jobCount: this.urlArray.length
    }

    // Selenium and setInterval currently only working with one worker
    if (this.seleniumOptions || this.interval) this.numWorkers = 1;

    // Initiate the cluster
    console.log('Master cluster setting up ' + this.numWorkers + ' workers');
    for (let i = 0; i < this.numWorkers; i++) {
      createWorker(statusMessage);
    }

    cluster.on('online', worker => console.log('Worker ' + worker.process.pid + ' is online'));

    // Restart workers on exit event (except for deliberate shutdown)
    cluster.on('exit', (worker, code, signal) => {
      if (code) {
        createWorker(statusMessage);
        console.log('Started a new worker');
      }
    });

    // Initiate interval to distribute jobs according to user. Default is to assign all jobs at once.
    if (this.interval) setInterval(() => assignJobs([this.urlArray.pop()], this.tries, cluster.workers, statusMessage), this.interval);
    else assignJobs(this.urlArray, this.tries, cluster.workers, statusMessage);
    // checkJobs(this.tries, cluster.workers, statusMessage);

    // Workers have only one listener to either execute or shutdown
  } else {
    process.on('message', message => {
      if (message.type === 'execute') this.get(message.url).execute();
      if (message.type === 'shutdown') {
        console.log('shutting down');
        process.exit(0);
      }
    });
  }
}


/**
* @description Creates a worker and sets up listeners for communication with master
*/
function createWorker(statMsg) {
  const worker = cluster.fork();
  worker.on('message', message => {
    if (!statMsg.jobs[message.url]) ++statMsg.messageCount;
    if (message.type === 'data' && statMsg.jobs[message.url]) {
      statMsg.data.push({ 'data': message.data, 'url': message.url });
      delete statMsg.jobs[message.url];
      console.log(--statMsg.jobCount); // WGS: Are we keeping these logs?
    }

    if (message.type === 'error' && statMsg.jobs[message.url]) {

      // If job has no ties left, push it to array and delete the job
      if (statMsg.jobs[message.url] === 0) {
        statMsg.errors.push(message.error);
        delete statMsg.jobs[message.url];
        console.log(--statMsg.jobCount); // WGS: Are we keeping these logs?
      }
    }

    if (statMsg.jobCount === 0) {
      Object.keys(cluster.workers).forEach(worker => {
        console.log('current worker is ', worker) // WGS: Are we keeping these logs?
        cluster.workers[worker].send({
          type: 'shutdown',
          from: 'master'
        });
      });

      console.log(statMsg);
      process.exit();
    }
  });
}

/**
* @description Assign all outstanding jobs to the workers on an interval
*/
function checkJobs (tries, workers, statMsg) {
  const urlArray = Object.keys(statMsg.jobs);
  let remainCount = urlArray.length;
  if(remainCount > 0) {
    setTimeout(() => {
      assignJobs(Object.keys(statMsg.jobs), tries, workers, statMsg);
      checkJobs(tries, workers, statMsg);
    }, remainCount > 100 ? remainCount * 50: 2000);
  } else { return }
}

/**
* @description Master distributes jobs to workers
* @param {Array} urlArray - Comes from value set by setURLs method on siphon object
*/
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
