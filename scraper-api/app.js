/**
 * Require modules
 */
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import path from 'path';
import {normalizePort} from './helpers/general';

/**
 * App constants and config
 */
import {APP_PORT} from './config';
const port = normalizePort(process.env.PORT || APP_PORT);

/**
 * Require Routes
 */
import home from './routes/home';
import search from './routes/search';

/**
 * App settings
 */
let app = express();
app.set('port', port);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * App start
 */
app.listen(app.get('port'), function() {
  console.log('Node app is running on http://localhost:' + app.get('port') );
});

/**
 * Routes
 */
app.use('/', home);
app.use('/api/search', search);

/**
 * Catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handler
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({status: 'Fail', message: 'Not Found'});
  //res.render('error');
});
