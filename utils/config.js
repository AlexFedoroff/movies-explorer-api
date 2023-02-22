require('dotenv').config();

const { NODE_ENV, PROD_DB } = process.env;

const MONGODB_URL = NODE_ENV === 'production' ? PROD_DB : 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  MONGODB_URL,
};
