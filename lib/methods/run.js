const cluster = require('cluster');

module.exports = function run () {
  if(cluster.isMaster) {
    //initiate object to store all uncompleted jobs, errors, and data
    const statusMessage = {
      jobs: {},
      errors: [],
      data: [],
      jobCount: this.urlArray.length,
      messageCount: 0,
      urlCount: 0
    }
    //set up workers function
    //includes logic to handle messages coming from workers
    var createWorker = () => {
      let worker = cluster.fork();
      worker.on('message', (message) => {
        if(statusMessage.jobs[message.url] === undefined) ++statusMessage.messageCount;
        if(message.type === 'data' && statusMessage.jobs[message.url] !== undefined) {
          statusMessage.data.push({ 'data': message.data, 'url': message.url });
          delete statusMessage.jobs[message.url];
          console.log(--statusMessage.jobCount);
        }
        if(message.type === 'error' && statusMessage.jobs[message.url] !== undefined) {
          //if job has no ties left push it to array and delete the job
          if(statusMessage.jobs[message.url] === 0) {
            statusMessage.errors.push(message.error);
            delete statusMessage.jobs[message.url];
            console.log(--statusMessage.jobCount);
          }
        }
        if(statusMessage.jobCount === 0) {
          Object.keys(cluster.workers).forEach( (worker) => {
            console.log('current worker is ', worker)
            cluster.workers[worker].send({
              type: 'shutdown',
              from: 'master'
            })
          })
          console.log(statusMessage);
          process.exit();
        }
      });
    }
    if(this.seleniumOptions || this.interval) this.numWorkers = 1;
    //initiate the cluster
    console.log('Master cluster setting up ' + this.numWorkers + ' workers');
    for(let i = 0; i < this.numWorkers; i++) { createWorker() }
    cluster.on('online', function(worker) { console.log('Worker ' + worker.process.pid + ' is online') });
    //restart workers on exit event (except for deliberate shutdown)
    cluster.on('exit', function(worker, code, signal) {
      if(code !== 0) {
        // console.log(`Worker ${worker.process.pid} died with code: ${code}`);
        createWorker();
        console.log('Started a new worker');
      }
    });
    //assign jobs
    var assignJobs = (urlArray) => {
      while(urlArray[0] !== undefined) {
        Object.keys(cluster.workers).forEach( (worker) => {
          if(urlArray[0] !== undefined) {
            let currentJob = urlArray.pop();
            statusMessage.jobs[currentJob] = this.tries;
            ++statusMessage.urlCount;
            cluster.workers[worker].send({ type: 'execute', url: currentJob, from: 'master'
            })
          }
        })
      }
    }
    //initiate loop
    if(this.interval) setInterval( () => assignJobs([this.urlArray.pop()]), this.interval);
    else assignJobs(this.urlArray)
    //assign all outstanding jobs to the workers on an interval
    var checkJobs = () => {
      var remainingJobs = Object.keys(statusMessage.jobs).length;
      if(remainingJobs < 1) return;
      if(remainingJobs > 0) {
        setTimeout(() => {
          assignJobs(Object.keys(statusMessage.jobs));
          checkJobs();
        }, remainingJobs > 100 ? remainingJobs * 50: 2000);
      } else { return }
    }
    checkJobs();
  } else {
    process.on('message', (message) => {
      if(message.type === 'execute') { this.get(message.url).execute() }
      if(message.type === 'shutdown') {
        console.log('shutting down');
        process.exit(0);
      }
    })
  }
}