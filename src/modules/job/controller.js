const moment = require('moment');
const config = require('config');
const { Job, JobApplicant } = require('./model');
const { Rank, Applicant } = require('../applicant/model');

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

JobController.listApplicant = async (req, res, next) => {
  const companyId = req.user.id;
  const jobId = req.params.id;
  const job = await Job.findById(jobId);
  if (job.company_id !== companyId) throw { message: 'Job not found', httpStatus: 400 };
  const applicants = await JobApplicant.getList({job_id: jobId});
  req.resData = { data: applicants };
  return next();
};

JobController.acceptJob = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.user.id;
  const job = await JobApplicant.findOne({
    where: { id, $company_id$: Number(companyId) },
    include: [{ model: Job, required: true }]
  } );
  if (!job) throw { message: 'Job not found', httpStatus: 400 };
  if (job.rejected_at) throw { message: 'Job has already been rejected', httpStatus: 400 };
  if (job.accepted_at) throw { message: 'Job applicant already accepted', httpStatus: 400 };
  await job.update({ accepted_at: moment() });
  delete job.dataValues.job;
  req.resData = { data: job.dataValues };
  return next();
};

JobController.completeJob = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.user.id;
  const job = await JobApplicant.findOne({
    where: { id, $company_id$: Number(companyId) },
    include: [{ model: Job, required: true }]
  } );
  if (!job) throw { message: 'Job not found', httpStatus: 400 };
  if (job.rejected_at) throw { message: 'Job has already been rejected', httpStatus: 400 };
  if (!job.accepted_at) throw { message: 'Job has not been accepted', httpStatus: 400 };
  if (job.completed_at) throw { message: 'Job has already completed', httpStatus: 400 };
  await job.update({ completed_at: moment() });
  delete job.dataValues.job;
  req.resData = { data: job.dataValues };
  return next();
};

JobController.promoteApplicant = async (req, res, next) => {
  const id = req.params.id;
  const job = await JobApplicant.findOne({ where: { id } });
  const applicant = await Applicant.findOne({ where: { id: job.applicant_id } });
  if (applicant.rank_id === Rank.B) {
    const jobCompleted = await JobApplicant.count({
      where: { applicant_id: applicant.id, completed_at: {$not: null} },
      logging: console.log
    });
    console.log(jobCompleted);
    if (jobCompleted >= 10 && applicant.rank_id === Rank.B)
      await applicant.update({ rank_id: Rank.A });
  }
  return next();
};

JobController.rejectJob = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.user.id;
  const job = await JobApplicant.findOne({
    where: { id, $company_id$: Number(companyId) },
    include: [{ model: Job, required: true }]
  } );
  if (!job) throw { message: 'Job not found', httpStatus: 400 };
  if (job.completed_at) throw { message: 'Job has already completed', httpStatus: 400 };
  if (job.rejected_at) throw { message: 'Job has already been rejected', httpStatus: 400 };
  await job.update({ rejected_at: moment() });
  delete job.dataValues.job;
  req.resData = { data: job.dataValues };
  return next();
}

module.exports = { JobController };