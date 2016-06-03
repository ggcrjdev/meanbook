"use strict";
var assert = require('assert');
var RouterUtils = require('../server/route/routerutils').RouterUtils;

describe('RouterUtils#sendWarnResponse(res, message)', function() {
  // Arrange
  var res = {
    json: function(data) {
      this.actual = data;
    }
  };
  var message = "message1";

  it('should produces an object with attribute type equal "warn"', function() {
    RouterUtils.sendWarnResponse(res, message);
    assert.equal('warn', res.actual.type);
  });
  it('should produces an object with attribute summary with the same message passed as parameter', function() {
    RouterUtils.sendWarnResponse(res, message);
    assert.equal('warn', res.actual.type);
  });
});

describe('RouterUtils#sendErrorResponse(key, res, err, httpStatusCode)', function() {
  // Arrange
  var key = "UNKNOW_KEY";
  var res = {
    status: function(httpStatus) {
      this.actualHttpStatus = httpStatus;
      return this;
    },
    send: function(data) {
      this.actual = data;
    }
  };
  var err = null;
  var httpStatusCode = 500;

  it('should produces an object with attribute type equal "error"', function() {
    RouterUtils.sendErrorResponse(key, res, err, httpStatusCode);
    assert.equal('error', res.actual.type);
  });
  it('should produces an object with attribute summary with value "UNKNOW_ERROR" representing the default error used when the key is unknow', function() {
    RouterUtils.sendErrorResponse(key, res, err, httpStatusCode);
    assert.equal('UNKNOW_ERROR', res.actual.summary);
  });
});
