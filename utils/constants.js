const OK_STATUS = 200;
const SECRET_KEY = 'my-not-really-secret-key';
const EMAIL_DBL_ERR_MSG = 'Такой email уже используется';
const PAGE_NOT_FOUND_ERROR_MSG = '404 - Страница не найдена';
const BAD_REQUEST_ERROR_MSG = 'Некорректный запрос';
const USER_NOT_FOUND_ERROR_MSG = 'Пользователь не найден';
const MOVIE_NOT_ACCESSIBLE_MSG = 'У вас нет прав на удаление этого фильма';
const MOVIE_NOT_FOUND_ERR_MSG = 'Фильм с указанным id не найден';
const NEED_AUTHORIZATION_ERR_MSG = 'Необходима авторизация';
const SERVER_ERROR_MSG = 'На сервере произошла ошибка';
const WRONG_MAIL_PWD_ERROR_MSG = 'Неверный email или пароль';
const WRONG_EMAIL_ERROR_MSG = 'Неверный email';

module.exports = {
  OK_STATUS,
  SECRET_KEY,
  EMAIL_DBL_ERR_MSG,
  PAGE_NOT_FOUND_ERROR_MSG,
  BAD_REQUEST_ERROR_MSG,
  USER_NOT_FOUND_ERROR_MSG,
  MOVIE_NOT_ACCESSIBLE_MSG,
  MOVIE_NOT_FOUND_ERR_MSG,
  NEED_AUTHORIZATION_ERR_MSG,
  SERVER_ERROR_MSG,
  WRONG_MAIL_PWD_ERROR_MSG,
  WRONG_EMAIL_ERROR_MSG,
};
