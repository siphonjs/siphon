const expect = require('chai').expect;
const siphon = require('../lib/Siphon');

let mySiphon;
beforeEach(() => {
  mySiphon = siphon();
});

afterEach(() => {
  mySiphon = null;
});

describe('default Siphon Object', () => {
  it('can have new properties added to it', () => {
    expect(mySiphon).to.be.extensible;
  });
});

describe('find method', () => {
  it('should insert search terms into Siphon Object', () => {
    mySiphon.find(/[0-9]{2}\.[0-9]/);
    expect(mySiphon.searchTerms).to.deep.equal([/[0-9]{2}\.[0-9]/]);
  });
});

describe('get method', () => {
  it('should insert single URL string into Siphon Object', () => {
    mySiphon.get('https://www.wunderground.com/cgi-bin/findweather/getForecast?query=90025')
    expect(mySiphon.urls).to.deep.equal(['https://www.wunderground.com/cgi-bin/findweather/getForecast?query=90025']);
  });
    
  it('should insert array of URLs into Siphon Object', () => {
    mySiphon.get(['https://www.wunderground.com/cgi-bin/findweather/getForecast?query=12345', 'https://www.wunderground.com/cgi-bin/findweather/getForecast?query=12346']);
    expect(mySiphon.urls).to.deep.equal(['https://www.wunderground.com/cgi-bin/findweather/getForecast?query=12345', 'https://www.wunderground.com/cgi-bin/findweather/getForecast?query=12346']);
  });
    
  it('should overwrite Siphon Object urls property when .get method is chained', () => {
    mySiphon.get('https://www.wunderground.com/cgi-bin/findweather/getForecast?query=90025')
    .get(['https://www.wunderground.com/cgi-bin/findweather/getForecast?query=12345', 'https://www.wunderground.com/cgi-bin/findweather/getForecast?query=12346']);
    expect(mySiphon.urls).to.deep.equal(['https://www.wunderground.com/cgi-bin/findweather/getForecast?query=12345', 'https://www.wunderground.com/cgi-bin/findweather/getForecast?query=12346']);
  });
});

describe('giveWorker method', () => {
  it('should insert URL intended for worker into Siphon Object', () => {
    mySiphon.giveWorker('https://www.wunderground.com/cgi-bin/findweather/getForecast?query=90025')
    expect(mySiphon.workerURL).to.equal('https://www.wunderground.com/cgi-bin/findweather/getForecast?query=90025');
  });
});

describe('notify method', () => {
  it('should add notifyFunction to Siphon Object', () => {
    mySiphon.notify(() => console.log('notify user'));
    expect(mySiphon.notifyFunction).to.be.an.instanceOf(Function);
  });
});

describe('retries method', () => {
  it('should modify tries in Siphon Object', () => {
    mySiphon.retries(3);
    expect(mySiphon.tries).to.equal(4);
  });
});

describe('selenium method', () => {
  it('should add browser and callback to seleniumOptions in Siphon Object', () => {
    const seleniumCallback = () => console.log('using selenium');
    mySiphon.selenium('chrome', seleniumCallback);
    expect(mySiphon.seleniumOptions).to.deep.equal({ browser: 'chrome', callback: seleniumCallback });
  });
});

describe('setHeaders method', () => {
  it('should add headers to Siphon Object', () => {
    mySiphon.setHeaders({ 'User-Agent': 'George Soowill' });
    expect(mySiphon.headers).to.deep.equal({ 'User-Agent': 'George Soowill' });
  });
});

describe('setInterval method', () => {
  it('should add interval length to Siphon Object', () => {
    mySiphon.setInterval(10);
    expect(mySiphon.interval).to.equal(10);
  });
});

describe('setProxies method', () => {
  it('should add proxies to Siphon Object', () => {
    mySiphon.setProxies(['192.168.1.0', '123.456.7.8']);
    expect(mySiphon.proxies).to.deep.equal(['192.168.1.0', '123.456.7.8']);
  });
});

describe('setWorkers method', () => {
  it('should modify number of workers in Siphon Object', () => {
    mySiphon.setWorkers(2);
    expect(mySiphon.numWorkers).to.equal(2);
  });
});
