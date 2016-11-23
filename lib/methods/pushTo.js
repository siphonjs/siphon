module.exports = function pushTo(array){
  array.push(this);
  return this;
}