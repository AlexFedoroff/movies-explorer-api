const { isURL } = require('validator');
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    maxlength: 64,
    required: true,
  },
  director: {
    type: String,
    minlength: 2,
    maxlength: 64,
    required: true,
  },
  duration: {
    type: Number,    
    required: true,
  },
  director: {
    type: String,
    minlength: 2,
    maxlength: 64,
    required: true,
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 1024,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: isURL,
  },
  trailerLink: {
    type: String,
    required: true,
    validate: isURL,
  },
  thumbnail: {
    type: String,
    required: true,
    validate: isURL,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },  
  movieId : {
    type: String,
    required: true,
  },
  nameRu : {
    type: String,    
    maxlength: 255,
    required: true,
  },
  nameEn : {
    type: String,    
    maxlength: 255,
    required: true,
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('movie', movieSchema);
