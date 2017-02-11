/**
 * Require modules
 */
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import {normalizePort} from './helpers/general';

/**
 * App constants and config
 */
import {APP_PORT} from './config';
import {version} from './package';
const port = normalizePort(process.env.PORT || APP_PORT);

/**
 * App settings
 */
let app = express();
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * App start
 */
app.listen(app.get('port'), function() {
  console.log('Node app is running on http://localhost:' + app.get('port') );
});

/**
 * Default Home Route
 */
app.get('/', function (req, res) {
  res.send('<html><body><h1>My web app http API! Version ' + version + '</h1></body></html>');
});

/**
 * POSTS Routes
 */
app.route('/api/:version/posts/')
  .get(function (req, res) {
    //model.getContent('posts').then(data => res.json(data)).catch(error => res.status(400).json(error));
  });

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
  res.status(err.status || 500).json({status: 'fail', message: 'Not Found'});
  //res.render('error');
});
