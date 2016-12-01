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
      jobCount: this.urlArray.length,
      messageCount: 0,
      urlCount: 0
    }

    /**
    * @description Creates a worker and sets up listeners for communication with master
    */
    function createWorker() {
      const worker = cluster.fork();
      worker.on('message', message => {
        if (!statusMessage.jobs[message.url]) ++statusMessage.messageCount;
        if (message.type === 'data' && statusMessage.jobs[message.url]) {
          statusMessage.data.push({ 'data': message.data, 'url': message.url });
          delete statusMessage.jobs[message.url];
          console.log(--statusMessage.jobCount); // WGS: Are we keeping these logs?
        }
        
        if (message.type === 'error' && statusMessage.jobs[message.url]) {
          
          // If job has no ties left, push it to array and delete the job
          if (statusMessage.jobs[message.url] === 0) {
            statusMessage.errors.push(message.error);
            delete statusMessage.jobs[message.url];
            console.log(--statusMessage.jobCount); // WGS: Are we keeping these logs?
          }
        }

        if (statusMessage.jobCount === 0) {
          Object.keys(cluster.workers).forEach(worker => {
            console.log('current worker is ', worker) // WGS: Are we keeping these logs?
            cluster.workers[worker].send({
              type: 'shutdown',
              from: 'master'
            });
          });

          console.log(statusMessage);
          process.exit();
        }
      });
    }

    // Selenium and setInterval currently only working with one worker
    if (this.seleniumOptions || this.interval) this.numWorkers = 1;
    
    // Initiate the cluster
    console.log('Master cluster setting up ' + this.numWorkers + ' workers'); // WGS: Are we keeping these logs?
    for (let i = 0; i < this.numWorkers; i++) {
      createWorker();
    }


    cluster.on('online', worker => console.log('Worker ' + worker.process.pid + ' is online')); // WGS: Are we keeping these logs?
    
    // Restart workers on exit event (except for deliberate shutdown)
    cluster.on('exit', (worker, code, signal) => {
      if (code) {
        createWorker();
        console.log('Started a new worker');
      }
    });

    /**
    * @description Master distributes jobs to workers
    * @param {Array} urlArray - Comes from value set by setURLs method on siphon object
    */
    function assignJobs(urlArray) {
      while (urlArray[0]) { // WGS: Why is this logic repeated 2 lines down?
        Object.keys(cluster.workers).forEach(worker => {
          if (urlArray[0]) {
            const currentJob = urlArray.pop();
            statusMessage.jobs[currentJob] = this.tries;
            ++statusMessage.urlCount;
            cluster.workers[worker].send({
              type: 'execute',
              url: currentJob,
              from: 'master'
            });
          }
        });
      }
    }

    // Initiate interval to distribute jobs according to user. Default is to assign all jobs at once.
    if (this.interval) setInterval(() => assignJobs([this.urlArray.pop()]), this.interval);
    else assignJobs(this.urlArray);
    
    /**
    * @description Assign all outstanding jobs to the workers on an interval
    */
    function checkJobs() {
      const jobs = Object.keys(statusMessage.jobs);
      const numberOfJobs = jobs.length;
      
      // Do nothing if no jobs left
      if (numberOfJobs < 1) return;
      
      // If jobs left, assign them and check again
      setTimeout(() => {
        assignJobs(jobs);
        checkJobs();
      }, numberOfJobs > 100 ? numberOfJobs * 50 : 2000);
    }

    checkJobs();

    // Workers have only one listener to either execute or shutdown
  } else {
    process.on('message', message => {
      if (message.type === 'execute') this.get(message.url).execute();
      if (message.type === 'shutdown') {
        console.log('shutting down'); // WGS: Are we keeping these logs?
        process.exit(0);
      }
    });
  }
}
