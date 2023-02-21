require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const corsOrigins = ['http://localhost:2900', 'http://localhost:80', 'http://localhost:3000', 'api.alexfedoroff.students.nomoredomainsclub.ru', 'http://alexfedoroff.students.nomoredomains.work', 'https://alexfedoroff.students.nomoredomains.work'];
const { PORT = 2900 } = process.env;
const app = express();

app.use(requestLogger);

app.use((req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  // console.log(req.headers);
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

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(error);

mongoose.set('strictQuery', false);
mongoose
  .connect('mongodb://localhost:27017/bitfilmsdb', {
    useUnifiedTopology: true, useNewUrlParser: true, autoIndex: true,
  });

app.listen(PORT, () => {
  console.log(`The App is running and listening to port ${PORT}`);
});
