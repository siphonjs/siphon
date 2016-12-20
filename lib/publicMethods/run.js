const cluster = require('cluster');
const request = require('request');

/**
* @description Initializes workers from master and sets logic to execute jobs
*/
module.exports = function run() {
  
  // If using Redis...
  if (this.client) {
    
    // Arrow functions maintain 'this' reference
    const checkRedis = () => {
      setTimeout(() => {
        console.log('listening: ', this.idle);
        if (this.idle) {
          this.idle = false;
          this.client.rpop('jobsQueue', (err, reply) => {
            if (err) throw new Error ('there was a problem pulling from the redis queue: ' + err);
            
            // Update urls in job
            const response = reply ? JSON.parse(reply, reviver) : { urls: [] };
            if(!response.interval) delete this.interval;
            Object.assign(this, response);
            // Process jobs until none left

            if (response.urls.length) processJobs(this);
            else this.idle = true
          });
        }

        // Recursively call function to continue checks every second
        checkRedis()}, 1000);
    }

    checkRedis();

  // Workers should not interact with Redis queue
  } else {
    this.idle = false;
    processJobs(this);
  }
}

/**
* @description Sets up the status message and the job queue behavior, contains most of the logic for executing jobs
*/
function processJobs(siphonObj) {
  if (cluster.isMaster) {
    if (siphonObj.searchTerms.length < 1 && !siphonObj.html && !siphonObj.seleniumOptions) return console.error('Please enter a search term, process html function, or selenium function and run again');
    if (siphonObj.urls.length < 1) return console.error('No urls in array');
    
    // Store all data along with any uncompleted jobs or errors
    const statusMessage = {
      id: siphonObj.urls[0],
      jobs: {},
      errors: [],
      data: [],
      jobCount: siphonObj.urls.length
    }

    // Selenium and setInterval currently only working with one worker
    if (siphonObj.seleniumOptions || siphonObj.interval) siphonObj.numWorkers = 1;

    // Initiate the cluster
    console.log('Master cluster setting up ' + siphonObj.numWorkers + ' workers');
    for (let i = 0; i < siphonObj.numWorkers; i++) {
      createWorker(statusMessage, siphonObj);
    }

    // Create event listeners for the master the first time cluster is initialized
    if (siphonObj.initial) {
      
      // Restart workers on exit event (except for deliberate shutdown)
      cluster.on('exit', (worker, code, signal) => {
        if (code) createWorker(statusMessage, siphonObj);
      });

      siphonObj.initial = false;
    }
    
    // Initiate interval to distribute jobs according to user. Default is to assign all jobs at once.
    assignJobs(siphonObj.urls, siphonObj.searchTerms, siphonObj.tries, cluster.workers, statusMessage, siphonObj.html, siphonObj.interval);
    siphonObj.urls = [];

    if (!siphonObj.seleniumOptions && !siphonObj.interval) checkJobs(siphonObj.searchTerms, siphonObj.tries, cluster.workers, statusMessage, siphonObj.html);

  //Workers have a listener for executing and shutting down
  } else {
    process.on('message', (message) => {
      if (message.type === 'execute') {
        siphonObj.searchTerms = message.searchTerms.map(term => parseRegex(term));
        siphonObj.html = new Function('return ' + message.htmlFunction)()
        if(message.curInterval) setTimeout( () => siphonObj.giveWorker(message.url).execute(), message.curInterval);
        else siphonObj.giveWorker(message.url).execute();
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

  worker.on('message', (message) => {
    if (message.type === 'data' && statMsg.jobs[message.data.url]) {
      statMsg.data.push(message.data);
      delete statMsg.jobs[message.data.url];
      console.log(--statMsg.jobCount);
    }

    if (message.type === 'error' && statMsg.jobs[message.error.url]) {
      --statMsg.jobs[message.error.url];
      // If job has no ties left, push it to array and delete the job
      if (statMsg.jobs[message.error.url] === 0) {
        statMsg.errors.push(message.error);
        delete statMsg.jobs[message.error.url];
        console.log(--statMsg.jobCount);
      }
    }
    
    if (statMsg.jobCount === 0 && siphonObj.idle === false) {
      Object.keys(cluster.workers).forEach(worker => {
        cluster.workers[worker].send({
          type: 'shutdown',
          from: 'master'
        });
      });
      if (siphonObj.notifyFunction) siphonObj.notifyFunction(statMsg, request);
      siphonObj.idle = true;
    }
  });
}

/**
* @description Assign all outstanding jobs to the workers on an interval
*/
function checkJobs(searchTerms, tries, workers, statMsg, htmlFunction) {
  const urlArray = Object.keys(statMsg.jobs);
  let remainCount = urlArray.length;
  if(remainCount > 0) {
    setTimeout(() => {
      assignJobs(Object.keys(statMsg.jobs), searchTerms, tries, workers, statMsg, htmlFunction);
      checkJobs(searchTerms, tries, workers, statMsg);
    }, remainCount > 100 ? remainCount * 50: 2000);
  } else { return }
}

/**
* @description Master distributes jobs to workers
* @param {Array} urlArray - Comes from value set by setURLs method on siphon object
*/
function assignJobs(urlArray, searchTerms, tries, workers, statMsg, htmlFunction, interval) {
  let num = 0;
  searchTerms = searchTerms.map(term => "__REGEXP " + term.toString());
  while (urlArray[0] !== undefined) {
    
    Object.keys(workers).forEach((worker) => {
      if (urlArray[0] !== undefined) {
        let currentJob = urlArray.pop();
        let curInterval = interval ? interval * num++ : false;
        if(statMsg.jobs[currentJob] === undefined) statMsg.jobs[currentJob] = tries;
        // console.log('this job should be showing up', currentJob,'|||', statMsg.jobs)
        workers[worker].send({
          type: 'execute', url: currentJob, htmlFunction: htmlFunction.toString(),
          curInterval, searchTerms, from: 'master'
        })
      }
    });
  }
}

const parseRegex = (regexStr) => {
  const m = regexStr.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
  return new RegExp(m[1], m[2] || "");
}

function reviver(key, value) {
  if (value !== null && value.toString().indexOf("__REGEXP ") == 0) {
    const m = value.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
    return new RegExp(m[1], m[2] || "");
  }
  if (typeof value === 'string' && (value.substring(0, 8) === 'function' || value.includes('=>'))) {
    return new Function('return ' + value)()
  }
  return value;
}