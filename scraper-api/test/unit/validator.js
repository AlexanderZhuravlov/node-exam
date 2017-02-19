const chai = require('chai');
const { validateParams, validateURL, checkResponse } = require('../../helpers/validator');
const errors = require('../../config/errors');
const config = require('../../config');

/* Variables for testing */
const testURL = 'http://google.com';
const testElement = 'h2';
const testLevel = '4';
const testDomain = 'google.com';
const notValidUrl = 'some_string';
const notValidElement = '$%*&a23';
const noValidLevel = 'string';

describe('Helper Validator', function () {
  describe('validateParams function', function () {
    it('should return error if URL parameter not sent', (done) => {
      validateParams({ element: testElement, level: testLevel })
        .then(
          response => {
            done(false);
          },
          error => {
            chai.expect(error).to.not.be.an('undefined');
            chai.expect(error).to.be.a('string');
            chai.expect(error).to.equal(errors.missingParams);
            done();
          });
    });
    it('should return error if Element parameter not sent', (done) => {
      validateParams({ url: testURL, level: testLevel })
        .then(
          response => {
            done(false);
          },
          error => {
            chai.expect(error).to.not.be.an('undefined');
            chai.expect(error).to.be.a('string');
            chai.expect(error).to.equal(errors.missingParams);
            done();
          });
    });
    it('should return params if Level parameter not sent', (done) => {
      validateParams({ url: testURL, element: testElement })
        .then(
          response => {
            chai.expect(response).to.not.be.an('undefined');
            chai.expect(response).to.be.an('object');
            chai.expect(lastMessage).to.have.property('url').that.is.a('string').to.equal(testURL);
            chai.expect(lastMessage).to.have.property('element').that.is.a('string').to.equal(testElement);
            chai.expect(lastMessage).to.have.property('level').that.is.a('string').to.equal(config.DEFAULT_SEARCH_LEVEL);
            done();
          },
          error => {
            done(false);
          });
    });
    it('should return error if Url parameter not valid', (done) => {
      validateParams({ url: notValidUrl, element: testElement, level: testLevel })
        .then(
          response => {
            done(false);
          },
          error => {
            chai.expect(error).to.not.be.an('undefined');
            chai.expect(error).to.be.a('string');
            chai.expect(error).to.equal(errors.errorUrlParam);
            done();
          });
    });
    it('should return error if Element parameter not valid', (done) => {
      validateParams({ url: testURL, element: notValidElement, level: testLevel })
        .then(
          response => {
            done(false);
          },
          error => {
            chai.expect(error).to.not.be.an('undefined');
            chai.expect(error).to.be.a('string');
            chai.expect(error).to.equal(errors.errorElementParam);
            done();
          });
    });
    it('should return error if Level parameter not valid', (done) => {
      validateParams({ url: testURL, element: testElement, level: noValidLevel })
        .then(
          response => {
            done(false);
          },
          error => {
            chai.expect(error).to.not.be.an('undefined');
            chai.expect(error).to.be.a('string');
            chai.expect(error).to.equal(errors.errorLevelParam);
            done();
          });
    });
  });

  describe('validateURL function', function () {
    it('should return false if Url and domain the same', (done) => {
      const result = validateURL(testURL, testDomain);
      chai.expect(result).to.not.be.an('undefined');
      chai.expect(result).to.be.a('boolean');
      chai.expect(result).to.equal(false);
      done();
    });
    it('should return false if Url is not a string', (done) => {
      const result = validateURL([], testDomain);
      chai.expect(result).to.not.be.an('undefined');
      chai.expect(result).to.be.a('boolean');
      chai.expect(result).to.equal(false);
      done();
    });
    it('should return false if Url is not valid', (done) => {
      const result = validateURL(notValidUrl, testDomain);
      chai.expect(result).to.not.be.an('undefined');
      chai.expect(result).to.be.a('boolean');
      chai.expect(result).to.equal(false);
      done();
    });
    it('should return true if Url and domain is not the same', (done) => {
      const result = validateURL(testURL, 'gmail.com');
      chai.expect(result).to.not.be.an('undefined');
      chai.expect(result).to.be.a('boolean');
      chai.expect(result).to.equal(true);
      done();
    });
  });

  describe('checkResponse function', function () {
    it('should return false if response headers Content Type is not acceptable', (done) => {
      const result = checkResponse({
        headers: {
          'content-type': 'image/png',
        },
        statusMessage: 'Ok',
        statusCode: 200,
      });
      chai.expect(result).to.not.be.an('undefined');
      chai.expect(result).to.be.a('boolean');
      chai.expect(result).to.equal(false);
      done();
    });
    it('should return false if response Status Message is not acceptable', (done) => {
      const result = checkResponse({
        headers: {
          'content-type': 'text/html',
        },
        statusMessage: 'Not Found',
        statusCode: 200,
      });
      chai.expect(result).to.not.be.an('undefined');
      chai.expect(result).to.be.a('boolean');
      chai.expect(result).to.equal(false);
      done();
    });
    it('should return false if response Status Code is not acceptable', (done) => {
      const result = checkResponse({
        headers: {
          'content-type': 'text/html',
        },
        statusMessage: 'OK',
        statusCode: 404,
      });
      chai.expect(result).to.not.be.an('undefined');
      chai.expect(result).to.be.a('boolean');
      chai.expect(result).to.equal(false);
      done();
    });
    it('should return true if response is correct', (done) => {
      const result = checkResponse({
        headers: {
          'content-type': 'text/html',
        },
        statusMessage: 'OK',
        statusCode: 200,
      });
      chai.expect(result).to.not.be.an('undefined');
      chai.expect(result).to.be.a('boolean');
      chai.expect(result).to.equal(true);
      done();
    });
  });
});
