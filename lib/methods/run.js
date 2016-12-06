const cluster = require('cluster');

/**
* @description Initializes workers from master and sets logic to execute jobs
*/
module.exports = function run() {
  if (cluster.isMaster) {
    // Store all data along with any uncompleted jobs or errors
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
      createWorker(statusMessage, this);
    }

    //create event listeners for the master the first time cluster is initialized
    if(this.initial) {

      // cluster.on('online', worker => console.log('Worker ' + worker.process.pid + ' is online'));

      // Restart workers on exit event (except for deliberate shutdown)
      cluster.on('exit', (worker, code, signal) => {
        if (code) {
          createWorker(statusMessage, this);
        }
      });
      this.initial = false;
    }
    // Initiate interval to distribute jobs according to user. Default is to assign all jobs at once.
    if (this.interval) {
      setInterval(() => assignJobs([this.urlArray.pop()], this.searchTerms, this.tries, cluster.workers, statusMessage), this.interval);
    } else {
      assignJobs(this.urlArray, this.searchTerms, this.tries, cluster.workers, statusMessage);
      this.urlArray = [];
    }
    checkJobs(this.searchTerms, this.tries, cluster.workers, statusMessage);

    //workers have a listener for executing and shutting down
  } else {
    process.on('message', message => {
      if (message.type === 'execute') {
        this.searchTerms = message.searchTerms.map( (term) => parseRegex(term));
        this.get(message.url).execute();
      }
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
function createWorker(statMsg, siphonObj) {
  const worker = cluster.fork();
  worker.on('message', message => {
    if (!statMsg.jobs[message.data.url]) ++statMsg.messageCount;
    if (message.type === 'data' && statMsg.jobs[message.data.url]) {
      statMsg.data.push({ 'data': message.data});
      delete statMsg.jobs[message.data.url];
      console.log(--statMsg.jobCount); // WGS: Are we keeping these logs?
    }

    if (message.type === 'error' && statMsg.jobs[message.error.url]) {
      --statMsg.jobs[message.error.url];
      // If job has no ties left, push it to array and delete the job
      if (statMsg.jobs[message.error.url] === 0) {
        statMsg.errors.push(message.error);
        delete statMsg.jobs[message.error.url];
        console.log(--statMsg.jobCount); // WGS: Are we keeping these logs?
      }
    }

    if (statMsg.jobCount === 0) {
      Object.keys(cluster.workers).forEach(worker => {
        cluster.workers[worker].send({
          type: 'shutdown',
          from: 'master'
        });
      });
      siphonObj.notifyFunction(statMsg)
      siphonObj.idle = true;
    }
  });
}

/**
* @description Assign all outstanding jobs to the workers on an interval
*/
function checkJobs (searchTerms, tries, workers, statMsg) {
  const urlArray = Object.keys(statMsg.jobs);
  let remainCount = urlArray.length;
  if(remainCount > 0) {
    setTimeout(() => {
      assignJobs(Object.keys(statMsg.jobs), searchTerms, tries, workers, statMsg);
      checkJobs(searchTerms, tries, workers, statMsg);
    }, remainCount > 100 ? remainCount * 50: 2000);
  } else { return }
}

/**
* @description Master distributes jobs to workers
* @param {Array} urlArray - Comes from value set by setURLs method on siphon object
*/
function assignJobs (urlArray, searchTerms, tries, workers, statMsg) {
  searchTerms = searchTerms.map( (term) => "__REGEXP " + term.toString());
  while(urlArray[0] !== undefined) {
    Object.keys(workers).forEach( (worker) => {
      if(urlArray[0] !== undefined) {
        let currentJob = urlArray.pop();
        statMsg.jobs[currentJob] = statMsg.jobs[currentJob] === undefined ? tries : statMsg.jobs[currentJob]--;
        workers[worker].send({ type: 'execute', url: currentJob, 
          searchTerms, from: 'master' })
      }
    })
  }
}

var parseRegex = (regexStr) => {
  var m = regexStr.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
  return new RegExp(m[1], m[2] || "");
}

function reviver(key, value) {
  if (value !== null && value.toString().indexOf("__REGEXP ") == 0) {
    var m = value.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
    return new RegExp(m[1], m[2] || "");
  } else
    return value;
}