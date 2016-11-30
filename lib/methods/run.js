const cluster = require('cluster');

module.exports = function run() {
  if(cluster.isMaster) {
    //initiate object to store all uncompleted jobs, errors, and data
    var running = true;
    const returnMessage = {
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
        if(returnMessage.jobs[message.url] === undefined) returnMessage.messageCount++;

        if(message.type === 'data' && returnMessage.jobs[message.url] !== undefined) {
          // console.log('message data ', message.data)
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
        if(returnMessage.jobCount === 0 && running) {
          running = false;
          Object.keys(cluster.workers).forEach( (worker) => {
            console.log('current worker is ', worker)
            cluster.workers[worker].send({
              type: 'shutdown',
              from: 'master'
            })
          })
          this.storeFunction(returnMessage);
          process.exit();
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
        // console.log(`Worker ${worker.process.pid} died with code: ${code}`);
        createWorker();
        console.log('Started a new worker');
      }
    });

    //assign jobs
    var assignJobs = (urlArray) => {
      while(urlArray[0] !== undefined) {
        Object.keys(cluster.workers).forEach( (worker) => {
          let currentJob = urlArray.pop();
          returnMessage.jobs[currentJob] = this.tries;
          returnMessage.urlCount++;
          cluster.workers[worker].send({
            type: 'execute',
            url: currentJob,
            from: 'master'
          })
        })
      }
    }
    //initiate loop
    assignJobs(this.urlArray);

    //assign all outstanding jobs to the workers on an interval
    var checkJobs = () => {
      var remainingJobs = Object.keys(returnMessage.jobs).length;
      if(remainingJobs < 1) return;
      if(remainingJobs > 0) {
        setTimeout(() => {
          assignJobs(Object.keys(returnMessage.jobs));
          console.log('remaining jobs ', remainingJobs, Object.keys(returnMessage.jobs))
          checkJobs();
        }, remainingJobs > 100 ? remainingJobs * 50: 2000);
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
