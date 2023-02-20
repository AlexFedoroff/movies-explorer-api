const router = require('express').Router();
const {
  getCards, createMovie, deleteMovie,
} = require('../controllers/cards');

const { createMovieValidate, movieIdValidate } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', createMovieValidate, createMovie);
router.delete('/:movieId', movieIdValidate, deleteMovie);

module.exports = router;
