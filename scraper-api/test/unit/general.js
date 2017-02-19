const chai = require('chai');
const general = require('../../helpers/general');

describe('Helper General', function () {
  describe('normalizePort function', function () {
    it('should return correct port number', (done) => {
      const port = general.normalizePort(3030);
      chai.expect(port).to.not.be.an('undefined');
      chai.expect(port).to.be.a('number');
      chai.expect(port).to.equal(3030);
      done();
    });
    it('should return correct port named', (done) => {
      const port = general.normalizePort('named');
      chai.expect(port).to.not.be.an('undefined');
      chai.expect(port).to.be.a('string');
      chai.expect(port).to.equal('named');
      done();
    });
    it('should return false if app port below 0', (done) => {
      const port = general.normalizePort(-10);
      chai.expect(port).to.not.be.an('undefined');
      chai.expect(port).to.be.a('boolean');
      chai.expect(port).to.equal(false);
      done();
    });
  });

  describe('getDomain function', function () {
    it('should return correct domain name if processed http', (done) => {
      const domain = general.getDomain('http://stackoverflow.com/questions/');
      chai.expect(domain).to.not.be.an('undefined');
      chai.expect(domain).to.be.a('string');
      chai.expect(domain).to.equal('stackoverflow.com');
      done();
    });
    it('should return correct domain name if processed https', (done) => {
      const domain = general.getDomain('https://www.google.com/imghp');
      chai.expect(domain).to.not.be.an('undefined');
      chai.expect(domain).to.be.a('string');
      chai.expect(domain).to.equal('www.google.com');
      done();
    });
  });
});
