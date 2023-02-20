const bcrypt = require('bcryptjs');
const { createToken } = require('../utils/jwt');
const User = require('../models/user');
const BadRequestError = require('../utils/bad-request-error');
const ConflictError = require('../utils/conflict-error');
const NotFoundError = require('../utils/not-found-error');
const UnauthorizedError = require('../utils/unauthorized-error');

const { OK_STATUS } = require('../utils/constants');

const prepareUserData = ({
  name, about, avatar, email, _id,
}) => ({
  _id, name, about, avatar, email,
});

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(OK_STATUS).send({ users }))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(OK_STATUS).send(prepareUserData(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой email уже используется'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь не найден!');
      const token = createToken({ _id: user._id });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: 'none', secure: true,
        })
        .send(prepareUserData(user))
        .end();
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
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      return res.status(OK_STATUS).send(prepareUserData(user));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  getUserById(req.params.userId, res, next);
};

const getCurrentUser = (req, res, next) => {
  getUserById(req.user._id, res, next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные профиля'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  login,
  logout,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
