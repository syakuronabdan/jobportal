const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');

const core = require('../../core/index');

const sequelize = core.sequelize.db;

const JobType = sequelize.define('jobType', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: 'job_type'
});

/**
 * Get a job type by id
 * @param {integer} id
 */
JobType.getById = id => JobType.findOne({ where: { id } });

module.exports = { JobType };
