const moment = require('moment');
const config = require('config');
const { Job, JobApplicant } = require('./model');
const { Rank } = require('../applicant/model');

const JobController = {};

JobController.create = async (req, res, next) => {
  const companyId = req.user.id;
  const data = await Job.create(Object.assign(
    Job.mapProps(req.body), { company_id: companyId }));
  req.resData = { data };
  return next();
};

JobController.update = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.user.id;
  const check = await Job.findOne({ where: { id, company_id: Number(companyId) } } );
  if (!check) throw { message: 'Job not found', httpStatus: 400 };
  await Job.update(Job.mapProps(req.body), { where: { id } });
  const job = await Job.findOne({ where: { id } } );
  req.resData = { data: job };
  return next();
};

JobController.checkApplicant = async (req, res, next) => {
  const jobId = req.params.id;
  const applId = req.user.id;
  const applied = await JobApplicant.findOne({ where: { job_id: jobId, applicant_id: applId } });
  if (applied) throw { message: `You've already applied once`, httpStatus: 400 };
  const startMonth = moment().startOf('month');
  const applyCount = await JobApplicant.count({
    where: {
      applicant_id: applId,
      created_at: { $gte: startMonth }
    }
  });
  const rank = req.user.rank_id === Rank.A? 'A' : 'B';
  if (applyCount >= config.maxApply[rank])
    throw { message: `You've reached your monthly apply quota`, httpStatus: 400 }
  return next();
};

JobController.apply = async (req, res, next) => {
  const jobId = req.params.id;
  const applId = req.user.id;
  const data = await JobApplicant.create({
    job_id: jobId,
    applicant_id: applId,
    cv_url: req.body.cv_url,
    linkedin: req.body.linkedin
  });
  req.resData = { data };
  return next();
};

JobController.listJob = async (req, res, next) => {
  const { q: name, city, job_type, min_salary, min_experience, page, company } = req.query;
  const companyId = req.params.id;
  const jobs = await Job.getList(Object.assign(
    Job.mapProps({city, job_type, min_salary, min_experience}),
    companyId ? {company_id: companyId} : {is_open: true, is_published: true},
    company ? {company_id: company} : {},
    name ? { name } : {},
    { page }
  ));
  req.resData = { data: jobs };
  return next();
};

module.exports = { JobController };