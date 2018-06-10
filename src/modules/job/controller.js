const { Job } = require('./model');

const JobController = {};

JobController.create = async (req, res, next) => {
  const companyId = req.user.id;
  const data = await Job.create(Object.assign(
    Job.mapProps(req.body, { company_id: companyId })));
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

module.exports = { JobController };