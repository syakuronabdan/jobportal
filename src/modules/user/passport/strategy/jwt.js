const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { UserType } = require('../../model');
const { Company } = require('../../../company/model');
const { Applicant } = require('../../../applicant/model');
const config = require('config');

const jwtParams = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

const createJWT = (type) => new JwtStrategy(jwtParams, async(jwtPayload, done) => {
  const User = type === UserType.COMPANY ? Company : Applicant;
  if (type !== jwtPayload.type) return done(null, false);
  const user = await User.findOne({ where: { id: jwtPayload.id } });
  if (user) {
    return done(null, user.toJSON());
  }
  return done(null, false);
});

module.exports = { createJWT };