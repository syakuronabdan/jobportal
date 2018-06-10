const constraints = {};

/**
 * Register
 */
constraints.create = {
  name: {
    presence: true,
  },
  job_function: {
    presence: true,
    numericality: true
  },
  job_type: {
    presence: true,
    numericality: true
  },
  city: {
    presence: true,
    numericality: true
  }
};

module.exports = constraints;
