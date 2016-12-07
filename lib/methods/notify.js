/**
* @description Saves the function callback as a property on the siphon object to later be used to
* send a notification when a job finishes
* @param {Function} callback - Applied to the statusMessage object in the 'run' method
* @return {Object} The siphon object to allow method chaining
*/
function notify(callback = setDefault) {
  if (!(callback instanceof Function)) throw new Error('Please insert callback function into .notify method');
  this.notifyFunction = callback;
  return this;
}

// Allows visualization of nested data in console
function setDefault(statMsg) {
  console.log(JSON.stringify(statMsg)); 
}

module.exports = notify;