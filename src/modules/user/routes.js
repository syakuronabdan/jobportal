const express = require('express');
const { validateLogin, jwtAuth, loginAuth, addToken } = require('./middleware');
const { UserController } = require('./controller');
const { UserType } = require('./model');
const constraints = require('./validation');
const core = require('../core');

const routes = express.Router();
const { wrap } = core.utils;
const { apiResponse, validateProp } = core.middleware;

/**
 * POST /companies/login
 * Authenticate company
 */
routes.post('/companies/login',
  validateProp(constraints.login, 'Login failed'),
  loginAuth(UserType.COMPANY),
  addToken,
  apiResponse());

/**
 * POST /applicants/login
 * Authenticate applicant
 */
routes.post('/applicants/login',
  validateProp(constraints.login, 'Login failed'),
  loginAuth(UserType.APPLICANT),
  addToken,
  apiResponse());

module.exports = routes;
