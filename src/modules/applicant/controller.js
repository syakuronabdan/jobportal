const { Applicant, Rank } = require('./model');

const ApplicantController = {};

ApplicantController.register = async (req, res, next) => {
  const { email, password, name } = req.body;
  const applicant = await Applicant.findOne({ where: { email } });
  if (applicant) throw { message: 'Email already taken', httpStatus: 400 };
  const data = await Applicant.create({
    email,
    password: Applicant.hashPasswordSync(password),
    name
  });
  req.resData = { data };
  return next();
};

module.exports = { ApplicantController };