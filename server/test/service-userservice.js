'use strict';
var assert = require('assert');
var UserService = require('../src/service/userservice').UserService;

describe('UserService#validateUsername(arg0)', function() {
  var cut = null;
  beforeEach(function() {
    cut = new UserService();
  });

  it('should returns false with the username equals to null', function() {
    var result = cut.validateUsername(null);
    assert.equal(false, result);
  });
  it('should returns false with the username equals to an empty string', function() {
    var result = cut.validateUsername('');
    assert.equal(false, result);
  });
  it('should returns false with the username equals to "go"', function() {
    var result = cut.validateUsername('go');
    assert.equal(false, result);
  });
  it('should returns false with the username equals to "01234567890123456789012345"', function() {
    var result = cut.validateUsername('01234567890123456789012345');
    assert.equal(false, result);
  });
  it('should returns false with the username equals to "gus."', function() {
    var result = cut.validateUsername('gus.');
    assert.equal(false, result);
  });
  it('should returns false with the username equals to ".gus"', function() {
    var result = cut.validateUsername('.gus');
    assert.equal(false, result);
  });
  it('should returns true with the username equals to "gus"', function() {
    var result = cut.validateUsername('gus');
    assert.equal(true, result);
  });
  it('should returns true with the username equals to "0123456789.0123456789-012"', function() {
    var result = cut.validateUsername('0123456789.0123456789-012');
    assert.equal(true, result);
  });
});
