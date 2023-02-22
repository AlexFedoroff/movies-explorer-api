require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGODB_URL } = require('./utils/config');

const corsOrigins = ['http://localhost:3000', 'http://alexfedoroff.students.nomoredomains.work', 'https://alexfedoroff.students.nomoredomains.work'];
const { PORT = 2900 } = process.env;
const app = express();

app.use(helmet());
app.use(requestLogger);

app.use((req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (corsOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});
/*
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
*/
app.use(bodyParser.json());
app.use(cookieParser());
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(error);

mongoose.set('strictQuery', false);
mongoose
  .connect(MONGODB_URL, {
    useUnifiedTopology: true, useNewUrlParser: true, autoIndex: true,
  });

app.listen(PORT, () => {
  console.log(`The App (v.0.9.023) is running and listening to port ${PORT}`);
});
