const constraints = {};

/**
 * Create job
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

constraints.apply = {
  cv_url: {
    presence: true
  }
};

module.exports = constraints;
