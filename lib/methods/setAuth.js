/**
* @description Sets the authentication of the request object on the siphon object
* @param {Object} auth - Authentication information in the format {user: username, pass: password}
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function setAuth(auth) {
  this.auth = auth;
  return this;
}