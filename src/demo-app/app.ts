import * as exp from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';  // Logger
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as gtrace from '@google-cloud/trace-agent';
import * as gdebug from '@google-cloud/debug-agent';

import { index } from './routes/index';
import { loggerAction } from './routes/logger-action';
import { happy } from './routes/happy';
import { Logger } from '../logger';

// Activate Google Cloud Trace and Debug when in production
if (process.env.NODE_ENV === 'production') {
  // gtrace.start();
  // gdebug.start();
}

const app = exp();

// view engine setup
app.set('../views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, '../../public/images', 'cube-16x16.png')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Add the request logger before anything else so that it can accurately log requests.
app.use(Logger.requestMiddleware);

app.use(exp.static(path.join(__dirname, '../public')));

// setup routes
app.use('/', index);
app.use('/logger-action', loggerAction);
app.use('/happy', happy);
// Responde to GAE healthcheck.
// If not provided, the server will replay with '404 - Not Found', which will be logged
app.get('/_ah/health', (req: exp.Request, res: exp.Response) => { res.send('I am healthy'); });

// catch 404 and forward to error handler
app.use(function (req: exp.Request, res: exp.Response, next: exp.NextFunction) {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Add the error logger after all middleware and routes so that it can log errors from the whole application.
// Any custom error handlers should go after this.
app.use(Logger.errorMiddleware);

// error handler
app.use(function (err: any, req: exp.Request, res: exp.Response, next: exp.NextFunction) {
  // set locals, only providing error in development
  const status = err.status || 500;
  res.locals.message = err.message;
  res.locals.status = status;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(status);
  res.render('error');
});

export const theApp: exp.Express = app;
