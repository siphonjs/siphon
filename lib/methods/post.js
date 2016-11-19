//function to store an http post request on the siphon object
// @params include the url, the path (includes query string), postData to send to the route, auth info (defaults to null), and the port (defaults to 80)

module.exports = function post (url, path, postData, auth, port = 80) {
  this.request = http.request({
    host: url,
    path: path,
    port: port,
    method: 'POST',
    //headers should default to web browser
    headers: {
      
    },
    auth: auth,
  });
  return this;
}