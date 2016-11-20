//updates the number of tries on the siphon object which defaults to 1
// @params triesToAdd is the number of additional tries for the job, defaults to 1
module.exports = function retries(triesToAdd = 1) {
  this.tries += triesToAdd;
  return this;
}