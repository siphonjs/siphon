const siphon = require('./../lib/Siphon');


var regularSiphon = siphon()
  .find(/[0-9]{2}\.[0-9]/)
  .retries(2)
  .store((data) => {
    // console.log(data);
  })
  .notify(statusMessage => console.log(statusMessage))
  .setRedis('6379', '138.68.48.182', 'siphontestingnodejsforcodesmith')
  .dequeueAndExecute()
  
