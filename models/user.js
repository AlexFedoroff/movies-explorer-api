const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const UnauthorizedError = require('../utils/unauthorized-error');
const { WRONG_MAIL_PWD_ERROR_MSG, WRONG_EMAIL_ERROR_MSG } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => isEmail(v),
      message: WRONG_EMAIL_ERROR_MSG,
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function auth(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(WRONG_MAIL_PWD_ERROR_MSG);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(WRONG_MAIL_PWD_ERROR_MSG);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
