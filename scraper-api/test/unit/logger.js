const chai = require('chai');
const fs = require('fs');
const logger = require('../../helpers/logger');
const logFilePatch = process.cwd() + '/logs/api.log';

/* Variables for testing */
const infoMessage = 'Info Message';
let logFile = '';

describe('Helper Logger', function () {
  describe('logger function', function () {

    before(function(done) {
      fs.readFile(logFilePatch, 'utf-8', (err, data) => {
        if (err) console.log('Log file', logFilePatch, 'does not exist');
        logFile = data.toString('utf-8').split("\n");
        done();
      });
    });

    it('should correct save info log', (done) => {
      logger.info(infoMessage);
      const lastMessage = JSON.parse(logFile[logFile.length - 2]);
      chai.expect(lastMessage).to.not.be.an('undefined');
      chai.expect(lastMessage).to.be.an('object');
      chai.expect(lastMessage).to.have.all.keys(['level', 'message', 'timestamp']);
      chai.expect(lastMessage).to.have.property('level').that.is.a('string').to.equal('info');
      chai.expect(lastMessage).to.have.property('message').that.is.a('string').to.equal(infoMessage);
      done();
    });
  });
});
