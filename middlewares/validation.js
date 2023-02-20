const { celebrate, Joi } = require('celebrate');

const urlRegEx = /https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?/;

const loginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30), 
  }),
});

const updateProfileValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

const createMoviedValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    image: Joi.string().required().pattern(urlRegEx),
    trailerLink: Joi.string().required().pattern(urlRegEx),
    thumbnail: Joi.string().required().pattern(urlRegEx),
    owner: Joi.string().required().length(24).hex(),
  }),
});

const movieIdValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  loginValidate,
  registerValidate,
  updateProfileValidate,
  validateGetUser,
  createMoviedValidate,
  movieIdValidate,
};
