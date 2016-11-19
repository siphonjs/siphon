//function to store an http get request on the siphon object
// @params include the url, the path (includes query string), auth info (defaults to null), and the port (defaults to 80)
module.exports = function get (url, path, auth = {}, port = 80) {
  this.request = http.request({
    host: url,
    path,
    port,
    method: 'GET',
    //headers should default to web browser
    headers: {
      
    },
    auth,
  });
  return this;
}