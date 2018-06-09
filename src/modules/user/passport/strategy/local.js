const { Strategy: LocalStrategy } = require('passport-local');
const { UserType } = require('../../model');
const { Company } = require('../../../company/model');
const { Applicant } = require('../../../applicant/model');

const createLocal = (type) => new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false,
  }, async (email, password, done) => {
    const User = type === UserType.COMPANY ? Company : Applicant;
    const user = await User.findOne({ where: { email } });
    if (!user) return done({ message: 'Email not found', httpStatus: 400 }, false);
    if (user.checkPassword(password)) {
      return done(null, user.toJSON({ withType: true }));
    }
    return done({ message: 'Wrong password', httpStatus: 400 }, false);
  }
);

module.exports = { createLocal };
