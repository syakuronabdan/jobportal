const { Company } = require('./model');

const CompanyController = {};

CompanyController.register = async (req, res, next) => {
  const { email, password, name, category, type, size, city } = req.body;
  const applicant = await Company.findOne({ where: { email } });
  if (applicant) throw { message: 'Email already taken', httpStatus: 400 };
  const data = await Company.create({
    email,
    password: Company.hashPasswordSync(password),
    name,
    description: req.body.description,
    company_category_id: category,
    company_type_id: type,
    company_size_id: size,
    city_id: city
  });
  req.resData = { data };
  return next();
};

module.exports = { CompanyController };