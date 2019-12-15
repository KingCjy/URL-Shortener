import express from 'express';
import dbconfig from './dbconfig';

const app = express();

app.use('/', require('./register/register-router'));

app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    data: err.data
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

export default app;
