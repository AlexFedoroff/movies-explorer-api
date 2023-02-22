const { checkToken } = require('../utils/jwt');
const UnauthorizedError = require('../utils/unauthorized-error');

module.exports = (req, _, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new UnauthorizedError('Необходима авторизация!'));
  try {
    req.user = checkToken(token);
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};
