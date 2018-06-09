/**
 * Wrap controller function
 * @param {function} fn
 */
const wrap = fn => (req, res, next) => fn(req, res, next).catch(e => next(e));

module.exports = { wrap };

