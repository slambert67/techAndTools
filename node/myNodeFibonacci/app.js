var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// mount middleware. mounted at '/' if first optional parameter omitted
// 3 arguments: request, response and next
app.use(logger('dev'));                                         // morgan request logger. Factory form: logger('dev') returns the actual middleware function
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());                                        // parses HTTP cookie headers and updates request object
app.use(express.static(path.join(__dirname, 'public')));

// router functions follow middleware
/*
  app.use has optional 1st parameter - the path the middleware is mounted on
*/
app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.get
// app.put


// if execution reaches this point it means no route was matched
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');            // or res.end
});

module.exports = app;
