const cluster = require('cluster');
const request = require('request');

/**
* @description Initializes workers from master and sets logic to execute jobs
*/
function run() {
  
  // If using Redis...
  if (this.client) {
    
    // Arrow functions maintain 'this' reference
    const checkRedis = () => {
      setTimeout(() => {
        console.log('listening: ', this.idle);
        if (this.idle) {
          this.idle = false;
          this.dequeue(this);
          this.client.rpop('jobsQueue', (err, reply) => {
            if (err) throw new Error ('Error pulling from the Redis queue: ' + err);
            
            // If 
            try {
              const response = JSON.parse(reply, reviver);
              if(!response.interval) delete this.interval;
              Object.assign(this, response);
              processJobs(this);
            } catch (e) {
              this.idle = true;
            }
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
* @description Sets up status message, job queue behavior, and logic for executing jobs
* @param {Object} siphonObj - Provides Siphon Object for access to its values
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

    // Due to Selenium and setInterval speed, only one worker is required
    if (siphonObj.seleniumOptions || siphonObj.interval) siphonObj.numWorkers = 1;

    // Initiate the cluster
    console.log('Master cluster setting up ' + siphonObj.numWorkers + ' workers');
    for (let i = 0; i < siphonObj.numWorkers; i++) {
      createWorker(statusMessage, siphonObj);
    }

    // Create event listeners for master the first time cluster is initialized
    if (siphonObj.initial) {
      
      // Restart workers on exit event (except for deliberate shutdown)
      cluster.on('exit', (worker, code, signal) => {
        if (code) createWorker(statusMessage, siphonObj);
      });

      siphonObj.initial = false;
    }
    
    // Initiate interval to distribute jobs according to user. By default, all jobs are assigned at once.
    assignJobs(siphonObj.urls, cluster.workers, statusMessage, siphonObj);
    siphonObj.urls = [];

    if (!siphonObj.seleniumOptions && !siphonObj.interval) checkJobs(cluster.workers, statusMessage, siphonObj);

  // Workers have a listener for executing and shutting down
  } else {
    process.on('message', (message) => {
      if (message.type === 'execute') {
        siphonObj.searchTerms = message.searchTerms.map(term => typeof term === 'string' ? parseRegex(term) : term);
        siphonObj.html = parseFunction(message.htmlFunction);
        if (message.seleniumOptions) {
          siphonObj.seleniumOptions = {
            browser: message.seleniumOptions.browser,
            callback: parseFunction(message.seleniumOptions.callback),
          }
        }

        if (message.curInterval) setTimeout( () => siphonObj.giveWorker(message.url).execute(), message.curInterval);
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
* @param {Object} statMsg - Provides status message
* @param {Object} siphonObj - Provides Siphon Object for access to its values
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

      // If job has no tries left, push it to array and delete the job
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

      siphonObj.notifyFunction(statMsg, request);
      siphonObj.idle = true;
    }
  });
}

/**
* @description Assigns all outstanding jobs to workers on a decreasing interval
* @param {Object} workers - References Node cluster workers
* @param {Object} statMsg - Provides status message
* @param {Object} siphonObj - Provides Siphon Object for later access to its values
*/
function checkJobs(workers, statMsg, siphonObj) {
  const urlArray = Object.keys(statMsg.jobs);
  let remainCount = urlArray.length;
  if (remainCount > 0) {
    setTimeout(() => {
      assignJobs(urlArray, workers, statMsg, siphonObj);
      checkJobs(workers, statMsg, siphonObj);
    }, remainCount > 100 ? remainCount * 50: 2000);
  }
}

/**
* @description Master distributes jobs to workers
* @param {Array} urlArray - Provides URLs included in get method
* @param {Object} workers - References Node cluster workers
* @param {Object} statMsg - Provides status message
* @param {Object} siphonObj - Provides Siphon Object for later access to its values
*/
function assignJobs(urlArray, workers, statMsg, siphonObj) {
  let num = 0;
  while (urlArray[0] !== undefined) {
    
    Object.keys(workers).forEach((worker) => {
      if (urlArray[0] !== undefined) {
        let currentJob = urlArray.pop();
        let curInterval = siphonObj.interval ? siphonObj.interval * num++ : false;
        if(statMsg.jobs[currentJob] === undefined) statMsg.jobs[currentJob] = siphonObj.tries;
        // console.log('this job should be showing up', currentJob,'|||', statMsg.jobs)

        workers[worker].send({
          type: 'execute', url: currentJob, htmlFunction: siphonObj.html,
          curInterval, searchTerms: siphonObj.searchTerms, 
          seleniumOptions: siphonObj.seleniumOptions, from: 'master'
        })
      }
    });
  }
}

/**
* @description Used as JSON.parse parameter to convert a RegExp string to a RegExp object
* @param {regexStr} - Stringified regular expression
* @return {RegExp} - A regular expression
*/
function parseRegex(regexStr) {
  const m = regexStr.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
  return new RegExp(m[1], m[2] || "");
}

/**
* @description Used as JSON.parse parameter to convert a function string to a function
* @param {funcStr} - Stringified function
* @return {function} - A revived function
*/
function parseFunction(funcStr) {
  return new Function('return ' + funcStr)();
} 

/**
* @description Used as JSON.parse parameter to convert a function string to a function
* @param {String} key - If reviver finds object or array, this represents each key
* @param {Any} value - If reviver finds object or array, this represents each value
* @return {Any} - Revives notify function with full functionality OR original value
*/
function reviver(key, value) {
  return key === 'notifyFunction' ? new Function('return ' + value)() : value;
}

module.exports = run;