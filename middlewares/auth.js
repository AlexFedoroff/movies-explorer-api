const { checkToken } = require('../utils/jwt');
const UnauthorizedError = require('../utils/unauthorized-error');
const { NEED_AUTHORIZATION_ERR_MSG } = require('../utils/constants');

module.exports = (req, _, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new UnauthorizedError(NEED_AUTHORIZATION_ERR_MSG));
  try {
    req.user = checkToken(token);
    return next();
  } catch (err) {
    return next(new UnauthorizedError(NEED_AUTHORIZATION_ERR_MSG));
  }
};
