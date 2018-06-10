const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');

const core = require('../../core/index');

const sequelize = core.sequelize.db;

const JobFunction = sequelize.define('jobFunction', {
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
  tableName: 'job_function'
});

/**
 * Get a job function by id
 * @param {integer} id
 */
JobFunction.getById = id => JobFunction.findOne({ where: { id } });

module.exports = { JobFunction };
