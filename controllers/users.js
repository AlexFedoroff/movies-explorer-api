const bcrypt = require('bcryptjs');
const { createToken } = require('../utils/jwt');
const User = require('../models/user');
const BadRequestError = require('../utils/bad-request-error');
const ConflictError = require('../utils/conflict-error');
const NotFoundError = require('../utils/not-found-error');
const UnauthorizedError = require('../utils/unauthorized-error');
const { EMAIL_DBL_ERR_MSG, BAD_REQUEST_ERROR_MSG, USER_NOT_FOUND_ERROR_MSG } = require('../utils/constants');

const { OK_STATUS } = require('../utils/constants');

const prepareUserData = ({
  email, name, _id,
}) => ({
  email, name, _id,
});

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      name: req.body.name,
      password: hash,
    }))
    .then((user) => {
      res.status(OK_STATUS).send(prepareUserData(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
      } else if (err.code === 11000) {
        next(new ConflictError(EMAIL_DBL_ERR_MSG));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = createToken({ _id: user._id });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'none', secure: true,
        })
        .send(prepareUserData(user));
    })
    .catch((err) => next(new UnauthorizedError(err.message)));
};

const logout = (_, res) => {
  res
    .clearCookie('jwt')
    .status(200)
    .send({ message: 'logout' });
};

const getUserById = (userId, res, next) => {
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_ERROR_MSG);
      }
      return res.status(OK_STATUS).send(prepareUserData(user));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  getUserById(req.user._id, res, next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_ERROR_MSG);
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
      } else if (err.code === 11000) {
        next(new ConflictError(EMAIL_DBL_ERR_MSG));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  logout,
  getCurrentUser,
  updateProfile,
};
