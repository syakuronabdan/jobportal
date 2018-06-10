const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');

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

module.exports = { Job };
