const constraints = {};

/**
 * Register
 */
constraints.register = {
  email: {
    email: true,
    presence: true,
  },
  password: {
    presence: true,
  },
  name: {
    presence: true,
  }
};

module.exports = constraints;
