const express = require('express');
const { CompanyController } = require('./controller');
const core = require('../core');
const constraints = require('./validation');

const routes = express.Router();
const { validateProp, apiResponse } = core.middleware;
const { wrap } = core.utils;

/**
 * POST /companies
 * Register companies
 */
routes.post('/companies',
  validateProp(constraints.register, 'Regitration failed'),
  wrap(CompanyController.register),
  apiResponse());

module.exports = routes;