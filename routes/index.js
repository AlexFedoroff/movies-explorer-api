const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const { login, logout, createUser } = require('../controllers/users');
const NotFoundError = require('../utils/not-found-error');
const { loginValidate, registerValidate } = require('../middlewares/validation');
const { PAGE_NOT_FOUND_ERROR_MSG } = require('../utils/constants');

router.post('/signup', registerValidate, createUser);
router.post('/signin', loginValidate, login);

router.use(auth);
router.post('/signout', logout);
router.use('/users', usersRoutes);
router.use('/movies', moviesRoutes);
router.use('*', (_, __, next) => { next(new NotFoundError(PAGE_NOT_FOUND_ERROR_MSG)); });

module.exports = router;
