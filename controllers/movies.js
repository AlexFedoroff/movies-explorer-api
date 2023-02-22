const BadRequestError = require('../utils/bad-request-error');
const NotFoundError = require('../utils/not-found-error');
const ForbiddenError = require('../utils/forbidden-error');
const { BAD_REQUEST_ERROR_MSG, MOVIE_NOT_ACCESSIBLE_MSG, MOVIE_NOT_FOUND_ERR_MSG } = require('../utils/constants');

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

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
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
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.findById(req.params.movieId).populate('owner')
    .orFail(() => new NotFoundError(MOVIE_NOT_FOUND_ERR_MSG))
    .then((movie) => {
      if (!movie.owner.equals(ownerId)) {
        return next(new ForbiddenError(MOVIE_NOT_ACCESSIBLE_MSG));
      }
      return movie.remove()
        .then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MSG));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
