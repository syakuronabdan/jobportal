const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const { Company } = require('../../company/model');
const { JobFunction } = require('./jobFunction');
const { JobType } = require('./jobType');
const { City } = require('../../city/model');

const core = require('../../core/index');

const sequelize = core.sequelize.db;

const Job = sequelize.define('job', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  company_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  job_function_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  job_type_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  city_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  min_salary: {
    type: DataTypes.FLOAT
  },
  max_salary: {
    type: DataTypes.FLOAT
  },
  min_experience: {
    type: DataTypes.INTEGER
  },
  max_experience: {
    type: DataTypes.INTEGER
  },
  vacancies: {
    type: DataTypes.INTEGER
  },
  is_open: {
    type: DataTypes.BOOLEAN
  },
  is_published: {
    type: DataTypes.BOOLEAN
  },
  description: {
    type: DataTypes.TEXT
  },
  requirement: {
    type: DataTypes.TEXT
  },
  responsibility: {
    type: DataTypes.TEXT
  },
  culture: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'job'
});

/**
 * Get a job by id
 * @param {integer} id
 */
Job.getById = id => Job.findOne({ where: { id } });

/**
 * Get jobs by condition
 * @param {Object} condition
 */
Job.getAll = (condition = {}) => Job.findAll({ where: condition });

/**
 * Get list of jobs with its relations
 */
Job.getList = (spec) => {
  const page = spec.page || 1;
  const limit = 10;
  const where = {};
  if (spec.city_id) where.city_id = spec.city_id;
  if (spec.job_type_id) where.job_type_id = spec.job_type_id;
  if (spec.min_salary) where.min_salary = { $gte: spec.min_salary };
  if (spec.min_experience) where.min_experience = { $gte: spec.min_experience };
  if (spec.name) where.name = { $like: `%${name}%`};
  if (spec.company_id) where.company_id = spec.company_id;
  if (spec.is_open !== undefined) where.is_open = spec.is_open;
  if (spec.is_published !== undefined) where.is_published = spec.is_published;

  return Job.findAndCountAll({
    where,
    include: [Company, JobFunction, JobType, City],
    limit,
    offset: (page - 1) * limit
  });
};

const dbColumns = {
  name: 'name',
  job_function: 'job_function_id',
  job_type: 'job_type_id',
  city: 'city_id',
  min_salary: 'min_salary',
  max_salary: 'max_salary',
  min_experience: 'min_experience',
  max_experience: 'max_experience',
  vacancies: 'vacancies',
  open: 'is_open',
  publish: 'is_published',
  description: 'description',
  requirement: 'requirement',
  responsibility: 'responsibility',
  culture: 'culture'
};
Job.mapProps = (props) => core.utils.matchDB(props, dbColumns);

Job.belongsTo(Company);
Job.belongsTo(JobFunction);
Job.belongsTo(JobType);
Job.belongsTo(City);

module.exports = { Job };
