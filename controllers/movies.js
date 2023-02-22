const BadRequestError = require('../utils/bad-request-error');
const NotFoundError = require('../utils/not-found-error');
const ForbiddenError = require('../utils/forbidden-error');

const Movie = require('../models/movie');
const { OK_STATUS } = require('../utils/constants');

const prepareMovieData = ({
  country, director, duration, year, description, image,
  trailerLink, thumbnail, owner, movieId, nameRU, nameEN,
}) => ({
  country,
  director,
  duration,
  year,
  description,
  image,
  trailerLink,
  thumbnail,
  owner,
  movieId,
  nameRU,
  nameEN,
});

const getMovies = (_, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies.map(prepareMovieData)))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
    runValidators: true,
  })
    .then((movie) => res.status(OK_STATUS).send(prepareMovieData(movie)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError('Фильм с указанным id не найден'))
    .then((movie) => {
      if (!movie.owner.equals(ownerId)) {
        return next(new ForbiddenError('У вас нет прав на удаление этого фильма'));
      }
      return movie.remove()
        .then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id фильма'));
      } else {
        next(err);
      }
    });
};

/*
const deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.findOneAndDelete({ movieId: req.params.movieId })
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм с указанным id не найден'));
      } else
      if (!movie.owner._id.equals(ownerId)) {
        throw new ForbiddenError('У вас нет прав на удаление этого фильма');
      } else {
        res.status(OK_STATUS).send({ movieId: req.params.movieId });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id фильма'));
      } else {
        next(err);
      }
    });
};
*/
module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
