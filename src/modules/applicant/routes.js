const express = require('express');
const { ApplicantController } = require('./controller');
const core = require('../core');
const constraints = require('./validation');

const routes = express.Router();
const { validateProp, apiResponse } = core.middleware;
const { wrap } = core.utils;

/**
 * POST /applicants
 * Register applicants
 */
routes.post('/applicants',
  validateProp(constraints.register, 'Regitration failed'),
  wrap(ApplicantController.register),
  apiResponse());

module.exports = routes;