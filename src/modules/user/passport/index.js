const passport = require('passport');
const { createLocal } = require('./strategy/local');
const { createJWT } = require('./strategy/jwt');
const { UserType } = require('../model');
const { Company } = require('../../company/model');
const { Applicant } = require('../../applicant/model');

function configure(app) {
  // eslint-disable-next-line no-underscore-dangle
  passport.serializeUser((user, done) => done(null, { id: user.id, type: user.type }));
  passport.deserializeUser((user, done) => {
    return user.type === UserType.APPLICANT
      ? Applicant.findById(user.id)
      : Company.findById(user.id)
    .then(user => done(null, user.toJSON({ withType: true })));
  });
  passport.use('company-local', createLocal(UserType.COMPANY));
  passport.use('applicant-local', createLocal(UserType.APPLICANT));
  passport.use('company-jwt', createJWT(UserType.COMPANY));
  passport.use('applicant-jwt', createJWT(UserType.APPLICANT));

  // add passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = { configure };
