const { Sequelize } = require('sequelize');
const cfg = require('config');

/**
 * Connect to mysql instance
 * @param {string} config
 * @return {Promise}
 */
function connect(config) {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: config.logging
  });
  return sequelize;
}

const db = connect(cfg.db);

module.exports = { db };
