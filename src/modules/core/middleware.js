const validate = require('validate.js');

const apiResponse = () => {
  return (req, res) => {
    const code = res.statusCode;
    const { status = true, message = 'Success', data = {} } = req.resData || {};
    return res.json({
        code,
        status,
        message,
        data,
    });
  };
};

const apiErrorResponse = () => {
  return (err, req, res, next) => {
    const statusCode = err.httpStatus || 406;
    const response = {
        status: false,
        code: statusCode,
        message: err.message,
        data: err.data,
    };
    res.status(statusCode).json(response);
  };
};

const validateProp = (constraints, msg) => {
  return (req, res, next) => {
    const hasError = validate(req.body, constraints);
    if (hasError) {
      next({ message: msg, data: hasError });
    }
    return next();
  };
};

module.exports = { apiResponse, apiErrorResponse, validateProp };
