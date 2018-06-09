const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
const { UserType } = require('../../user/model/index');

const core = require('../../core/index');

const sequelize = core.sequelize.db;

// used by bcrypt to generate new salt
// 8 rounds will produce about 40 hashes per second on a 2GHz core
// see: https://www.npmjs.com/package/bcrypt
const SALT_ROUND = 8;

const Company = sequelize.define('company', {
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
  description: {
    type: DataTypes.TEXT
  },
  company_category_id: {
    type: DataTypes.INTEGER.UNSIGNED
  },
  company_type_id: {
    type: DataTypes.INTEGER.UNSIGNED
  },
  company_size_id: {
    type: DataTypes.INTEGER.UNSIGNED
  },
  city_id: {
    type: DataTypes.INTEGER.UNSIGNED
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'company'
});

/**
 * Create password hash from plain text synchronously
 * @param {string} str
 */
Company.hashPassword = async str => await bcrypt.hash(str, SALT_ROUND);
Company.hashPasswordSync = str => bcrypt.hashSync(str, SALT_ROUND);

/**
 * Get a user by id
 * @param {integer} id
 */
Company.getById = id => Company.findOne({ where: { id } });

/**
 * Get a user by condition
 * @param {Object} condition
 */
Company.getAll = (condition = {}) => Company.findAll({ where: condition });

/**
 * Compare plain password with it's hashed password
 * @param {string} plain
 * @return {bool}
 */
// eslint-disable-next-line
Company.prototype.checkPassword = function (plain) {
  return bcrypt.compareSync(plain, this.get('password'));
};

// eslint-disable-next-line
Company.prototype.toJSON = function ({ withType } = {}) {
  const values = Object.assign({}, this.get());

  delete values.password;
  if (withType) values.type = UserType.COMPANY;
  return values;
};

module.exports = { Company };
