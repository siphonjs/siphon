const expect = require('chai').expect;
const siphon = require('../lib/Siphon');

let mySiphon;
beforeEach(() => {
  mySiphon = siphon();
});

describe('default Siphon Object', () => {
  it('can have new properties added to it', () => {
    expect(mySiphon).to.be.extensible;
  });

  it('has a URLs property whose default value is an empty array', () => {
    expect(mySiphon.urls).to.deep.equal([]);
  });

  it('has a searchTerms property whose default value is an empty array', () => {
    expect(mySiphon.searchTerms).to.deep.equal([]);
  });

  it('has a numWorkers property whose default value is the user\'s number of CPU cores', () => {
    expect(mySiphon.numWorkers).to.equal(require('os').cpus().length);
  });

  it('has a tries property whose default value is 1', () => {
    expect(mySiphon.tries).to.equal(1);
    });
  
  it('has an idle property whose default value is true', () => {
    expect(mySiphon.idle).to.equal(true);
    });
  
  it('has an initial property whose default value is true', () => {
    expect(mySiphon.initial).to.equal(true);
  });
});
