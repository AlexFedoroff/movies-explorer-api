const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const SECRET_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'XN0cmF0b3IiXX0.0O6PmUz5UchJ_I45t-gOCOJA2_y_oPOHT0OwWAUrWTc';
const createToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
const checkToken = (token) => jwt.verify(token, SECRET_KEY);

module.exports = { createToken, checkToken };
