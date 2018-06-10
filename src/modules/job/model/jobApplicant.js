const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');

const core = require('../../core/index');

const sequelize = core.sequelize.db;

const JobApplicant = sequelize.define('jobApplicant', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  job_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  applicant_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  linkedin: {
    type: DataTypes.STRING(100)
  },
  cv_url: {
    type: DataTypes.STRING(100)
  },
  accepted_at: {
    type: DataTypes.DATE
  },
  completed_at: {
    type: DataTypes.DATE
  },
  rejected_at: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'job_applicant'
});

/**
 * Get a job by id
 * @param {integer} id
 */
JobApplicant.getById = id => JobApplicant.findOne({ where: { id } });

/**
 * Get jobs by condition
 * @param {Object} condition
 */
JobApplicant.getAll = (condition = {}) => JobApplicant.findAll({ where: condition });

module.exports = { JobApplicant };
