//sets the authentication of the request object on the siphon object
// @params an object containing the authentication information in the format {user: username, pass: password}

module.exports = function setAuth(auth) {
  this.auth = auth;
  return this;
}