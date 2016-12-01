//sets the proxy value of the siphon object
// @params takes the full url of the proxy in string format, example: "http://proxyuser:123@proxy.foo.com:8080";

module.exports = function setProxies(proxies) {
  this.proxies = proxies;
  return this;
}