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
  },
  category: {
    presence: true,
    numericality: true
  },
  type: {
    presence: true,
    numericality: true
  },
  size: {
    presence: true,
    numericality: true
  },
  city: {
    presence: true,
    numericality: true
  }
};

module.exports = constraints;
