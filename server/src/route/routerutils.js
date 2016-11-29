'use strict';
var AppError = function(code, key, detail) {
  this.code = code;
  this.key = key;
  this.detail = detail + '.';
};

var routerUtils = {
  errorMessages: {
    MONGODB_QUERY_EXEC_ERROR: new AppError(100, 'MONGODB_QUERY_EXEC_ERROR', 'Error to access your data in database'),
    APP_USER_NOT_FOUND: new AppError(200, 'APP_USER_NOT_FOUND', 'Your username is required to access the app'),
    APP_USERNAME_INVALID: new AppError(200, 'APP_USERNAME_INVALID', 'Your username is not valid'),
    UNKNOW_ERROR: new AppError(999, 'UNKNOW_ERROR', 'Unknow error')
  },
  sendErrorResponse: function(key, res, err, httpStatusCode) {
    var errorMessage = this.errorMessages[key];
    if (!errorMessage)
      errorMessage = this.errorMessages.UNKNOW_ERROR;
    if (!httpStatusCode)
      httpStatusCode = 500;

    console.error('Execution error with code = [' + errorMessage.code + '] and summary [' + errorMessage.key);
    console.error(err);
    res.status(httpStatusCode).send({
      type: 'error',
      summary: errorMessage.key,
      detail: errorMessage.detail,

      code: errorMessage.code,
      cause: (err) ? err.message : null
    });
  },
  sendInfoResponse: function(res, message) {
    this.sendTypedResponse(res, 'info', message);
  },
  sendWarnResponse: function(res, message) {
    this.sendTypedResponse(res, 'warn', message);
  },
  sendTypedResponse: function(res, type, message) {
    res.json({
      type: type,
      summary: message,
      detail: message
    });
  }
};

module.exports = {
  RouterUtils: routerUtils
};
