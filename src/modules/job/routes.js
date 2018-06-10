const express = require('express');
const { JobController } = require('./controller');
const core = require('../core');
const user = require('../user');
const constraints = require('./validation');

const routes = express.Router();
const { jwtAuth } = user.middleware;
const { validateProp, apiResponse } = core.middleware;
const { wrap } = core.utils;

/**
 * POST /companies/:id/jobs
 * Create a job
 */
routes.post('/jobs',
  jwtAuth(user.model.UserType.COMPANY),
  validateProp(constraints.create, 'Create job failed'),
  wrap(JobController.create),
  apiResponse());

/**
 * PATCH /jobs/:id
 * Update job
 */
routes.patch('/jobs/:id',
  jwtAuth(user.model.UserType.COMPANY),
  wrap(JobController.update),
  apiResponse());

/**
 * POST /jobs/:id/apply
 * Apply for a job
 */
routes.post('/jobs/:id/apply',
  jwtAuth(user.model.UserType.APPLICANT),
  wrap(JobController.checkApplicant),
  wrap(JobController.apply),
  apiResponse());

/**
 * GET /jobs
 * View posted jobs
 */
routes.get('/jobs',
  wrap(JobController.listJob),
  apiResponse());

/**
 * GET /companies/:id/jobs
 * View posted jobs by a company
 */
routes.get('/companies/:id/jobs',
  jwtAuth(user.model.UserType.COMPANY),
  wrap(JobController.listJob),
  apiResponse());

/**
 * GET /jobs/:id/applicants
 * View applicants on a job
 */
routes.get('/jobs/:id/applicants',
  jwtAuth(user.model.UserType.COMPANY),
  wrap(JobController.listApplicant),
  apiResponse());

module.exports = routes;