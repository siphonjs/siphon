

const request = require('request');

const options = {
  method: 'GET',
  uri: '',
  auth: {
    user: '',
    pass: '',
    sendImmediately: false
  }
}

request(options, function(error, response, body) {
  if(err) console.log(err);
  else {
    console.log('we got something back');
    console.log(body);
  }
});


// http://unqualified-reservations.blogspot.com/2008/06/ol9-how-to-uninstall-cathedral.html