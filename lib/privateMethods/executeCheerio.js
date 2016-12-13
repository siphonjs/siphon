/**
* @description If user provides Cheerio callback, then we serve it html
* then tell master to delete job
* @param {String} html - The html returned from our GET request
* @param {String} workerURL - Used as ID to delete job from queue upon completion
* @return {Object} The siphon object to allow method chaining
*/
module.exports = function executeCheerio(html, workerURL) {
  cheerioFunction(html, workerURL);
  process.send({
    type: 'data',
    data: { data: 'Cheerio callback executed', url: workerURL }
  });
}