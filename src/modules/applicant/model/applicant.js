const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');

const core = require('../../core/index');

const sequelize = core.sequelize.db;

// used by bcrypt to generate new salt
// 8 rounds will produce about 40 hashes per second on a 2GHz core
// see: https://www.npmjs.com/package/bcrypt
const SALT_ROUND = 8;

const Rank = {
  B: 1,
  A: 2
};

const Applicant = sequelize.define('applicant', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(100),
    defaultValue: null,
    allowNull: true,
  },
  rank_id: {
    type: DataTypes.INTEGER.UNSIGNED
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: 'applicant'
});

/**
 * Create password hash from plain text synchronously
 * @param {string} str
 */
Applicant.hashPassword = async str => await bcrypt.hash(str, SALT_ROUND);
Applicant.hashPasswordSync = str => bcrypt.hashSync(str, SALT_ROUND);

/**
 * Get a user by id
 * @param {integer} id
 */
Applicant.getById = id => Applicant.findOne({ where: { id } });

/**
 * Get a user by condition
 * @param {Object} condition
 */
Applicant.getAll = (condition = {}) => Applicant.findAll({ where: condition });

/**
 * Compare plain password with it's hashed password
 * @param {string} plain
 * @return {bool}
 */
// eslint-disable-next-line
Applicant.prototype.checkPassword = function (plain) {
  return bcrypt.compareSync(plain, this.get('password'));
};

// eslint-disable-next-line
Applicant.prototype.toJSON = function ({ withType } = {}) {
  const values = Object.assign({}, this.get());

  delete values.password;
  if (withType) values.type = UserType.COMPANY;
  return values;
};

module.exports = { Applicant, Rank };
