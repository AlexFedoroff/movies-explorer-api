const SERVER_ERROR_MSG = require('../utils/constants');

const error = (err, _, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? SERVER_ERROR_MSG : message,
  });

  next();
};

module.exports = error;
