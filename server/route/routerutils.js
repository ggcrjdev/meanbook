var AppError = function(code, key, detail) {
  this.code = code;
  this.key = key;
  this.detail = detail + '.';
};

var routerUtils = {
  errorMessages: {
    MONGODB_QUERY_EXEC_ERROR: new AppError(100, 'MONGODB_QUERY_EXEC_ERROR', 'Error to access your data in database'),
    APP_USER_NOT_FOUND: new AppError(200, 'APP_USER_NOT_FOUND', 'Define an user to access this app'),
    UNKNOW_ERROR: new AppError(999, 'UNKNOW_ERROR', 'Unknow error')
  }
};

routerUtils.sendErrorResponse = function(key, res, err, httpStatusCode) {
  var errorMessage = routerUtils.errorMessages[key];
  if (!errorMessage) {
    errorMessage = routerUtils.errorMessages['UNKNOW_ERROR'];
  }
  if (!httpStatusCode) {
    httpStatusCode = 500;
  }

  console.error('Execution error with code = [' + errorMessage.code + '] and summary [' + errorMessage.key);
  console.error(err);
  res.status(httpStatusCode).send({
    type: 'error',
    summary: errorMessage.key,
    detail: errorMessage.detail,

    code: errorMessage.code,
    cause: (err) ? err.message : null
  });
};
routerUtils.sendInfoResponse = function(res, message) {
  routerUtils.sendTypedResponse(res, 'info', message);
};
routerUtils.sendWarnResponse = function(res, message) {
  routerUtils.sendTypedResponse(res, 'warn', message);
};
routerUtils.sendTypedResponse = function(res, type, message) {
  res.json({
    type: type,
    summary: message,
    detail: message
  });
};

module.exports = {
  RouterUtils: routerUtils
};