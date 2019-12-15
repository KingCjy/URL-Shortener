import * as express from 'express';

const app = express();

app.use('/', require('./register/register-router'));

interface Err extends Error {
  status: number;
  data?: any;
}

app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
  let err = new Error('Not Found') as Err;
  err.status = 404;
  next(err);
});

app.use(function (err: Err, req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    data: err.data
  });
});

export default app;
