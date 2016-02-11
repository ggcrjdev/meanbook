var routerUtils = {};
routerUtils.prototype = {
  sendErrorResponse: function(err, res, code, httpStatusCode) {
    if (!code) {
      code = 999;
    }
    if (!httpStatusCode) {
      httpStatusCode = 500;
    }

    console.error('Erro de execução com code = ' + code);
    console.error(err);
    res.status(httpStatusCode).send({
      type: 'error',
      code: code,
      message: err.message
    });
  },
  sendInfoResponse: function(res, message) {
    res.json({
      type: 'info',
      message: message
    });
  }
};

module.exports = {
  RouterUtils: routerUtils
};