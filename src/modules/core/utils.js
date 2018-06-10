/**
 * Wrap controller function
 * @param {function} fn
 */
const wrap = fn => (req, res, next) => fn(req, res, next).catch(e => next(e));

/**
 * Transform supplied data properties to match with db column
 * @param input {object}
 * @param columnName {object}
 * @returns {object}
 */
const matchDB = (input, columnName) => {
  return Object.keys(input).reduce((matched, prop) => {
    if (columnName[prop] && input[prop] !== undefined) matched[columnName[prop]] = input[prop];
    return matched;
  }, {});
}

module.exports = { wrap, matchDB };

