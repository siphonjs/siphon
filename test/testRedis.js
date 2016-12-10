const redis = require('redis');
const client = redis.createClient();
const chai = require('chai');
const siphon = require('../lib/Siphon');
chai.should();

const temps = [];
for (let i = 90025; i < 90030; i++) {
  temps.push(`https://www.wunderground.com/cgi-bin/findweather/getForecast?query=${i}`);
}

before(() => {
  client.flushdb();
  const mySiphon = siphon()
    .setURLs(temps)
    .find(/[0-9]{2}\.[0-9]/)
    .setRedis();
});
// 'this' must be siphon object
describe('enqueue', () => {
  it('should insert job into Redis queue titled "jobsQueue"', () => {
    mySiphon.enqueue()
    // should logic
  });
});

// what happens if queue is empty?
describe('dequeue', () => {
  it('should remove job from Redis "jobsQueue"', () => {
    mySiphon.dequeue()
    // should logic
  });
});

// calls .run so more complicated test
describe('dequeueAndExecute', () => {
  it('should dequeue and execute', () => {

  });
});
