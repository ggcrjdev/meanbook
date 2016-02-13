var AppError = function(code, key, detail) {
  this.code = code;
  this.key = key;
  this.detail = detail + '.';
};

var routerUtils = {
  errorMessages: {
    MONGODB_ERRO_EXECUCAO_QUERY: new AppError(100, 'MONGODB_ERRO_EXECUCAO_QUERY', 'Erro durante a obtenção de resultados'),
    APP_USUARIO_NAO_INFORMADO: new AppError(200, 'APP_USUARIO_NAO_INFORMADO', 'Define um usuário para acessar a app'),
    GERAL_ERRO_DESCONHECIDO: new AppError(999, 'GERAL_ERRO_DESCONHECIDO', 'Erro desconhecido')
  }
};

routerUtils.sendErrorResponse = function(key, res, err, httpStatusCode) {
  var errorMessage = routerUtils.errorMessages[key];
  if (!errorMessage) {
    errorMessage = routerUtils.errorMessages['GERAL_ERRO_DESCONHECIDO'];
  }
  if (!httpStatusCode) {
    httpStatusCode = 500;
  }

  console.error('Erro de execução com code = [' + errorMessage.code + '] e summary [' + errorMessage.key);
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