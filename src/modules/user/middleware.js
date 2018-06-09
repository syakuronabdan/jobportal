const passport = require('passport');
const validate = require('validate.js');
const constraints = require('./validation');
const jwt = require('jsonwebtoken');
const config = require('config');
const { UserType } = require('./model');

const loginAuth = (type) => {
  return (req, res, next) => {
    const strategy = type === UserType.APPLICANT ? 'applicant-local' : 'company-local';
    passport.authenticate(strategy, (err, user) => {
      if (err) return next(err);
      if (!user) {
        err = { message: 'Wrong password', httpStatus: 400 };
        return next(err);
      }
      req.user = user;
      return next();
    })(req, res, next);
  };
};

const jwtAuth = (type) => {
  return (req, res, next) => {
    const strategy = type === UserType.APPLICANT ? 'applicant-jwt' : 'company-jwt';
    passport.authenticate(strategy, (err, user) => {
      if (err) return next(err);
      if (!user) {
        err = { message: 'Unauthorized', httpStatus: 401 };
        return next(err);
      }
      req.user = user;
      return next();
    })(req, res, next);
  };
};

const addToken = (req, res, next) => {
  const payload = { id: req.user.id, type: req.user.type };
  req.user.token = jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
  req.resData = { data: req.user };
  return next();
};

module.exports = { loginAuth, jwtAuth, addToken };
