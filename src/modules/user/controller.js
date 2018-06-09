const jwt = require('jsonwebtoken');
const { User } = require('./model');
const { jwt: jwtOptions } = require('config');

const UserController = {};

module.exports = { UserController };