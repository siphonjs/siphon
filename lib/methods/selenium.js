module.exports = function (browser, callback) {
	this.seleniumOptions = {browser, callback};
	return this;
}
