const cluster = require('cluster');

module.exports = function run () {
  if(this.urlArray === undefined) {
    this.execute();
    return;
  }

  if(cluster.isMaster) {
    //set up workers
    console.log('Master cluster setting up ' + 4 + ' workers');
    for(let i = 0; i < 4; i++) {
      var worker = cluster.fork();
      worker.on('message', (message) => console.log(message));
    }
    cluster.on('online', function(worker) {
      console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
      if(code !== 0) {
        console.log(`Worker ${worker.process.pid} died with code: ${code}`);
        cluster.fork();
        console.log('Started a new worker');
      }
    });

    //logic

    var wid, workerIds = [];
    for(wid in cluster.workers) {
      workerIds.push(wid);
    }

    while(this.urlArray) {
      for(let j = 0; j < 4 && this.urlArray[0] !== undefined; j++) {
        console.log('hey we have something in the array ');
        cluster.workers[workerIds[j]].send({
          type: 'execute',
          url: this.urlArray.pop(),
          from: 'master'
        })
      }
    }

  } else {
    process.on('message', (message) => {
      if(message.type === 'execute') {
        console.log('here is the url', message.url);
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