before(function (done) {

  // Timeout for start app
  this.timeout(3000);

  // start app for tests
  done();
});

after(function (done) {
  // here you can clear fixtures, etc.
  done();
});
