const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');

const core = require('../../core/index');

const sequelize = core.sequelize.db;

const City = sequelize.define('city', {
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
  tableName: 'city'
});

/**
 * Get a city by id
 * @param {integer} id
 */
City.getById = id => City.findOne({ where: { id } });

module.exports = { City };
