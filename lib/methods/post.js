/**
* @description Stores an http post request on the siphon object
* @param {String} url,
* @param {String} path (includes query string),
* @param {String} postData to send to the route
* @param {String} auth info (defaults to null)
* @param {Number} port (defaults to 80)
* @return {Object} The siphon object to allow method chaining
*/
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