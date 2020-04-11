const mongoose = require('mongoose')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()


// app init, connect database
var app = express();
var session = require('express-session')
var db = mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true })
var MongoStore = require('connect-mongo')(session);
app.use(session({
	secret: process.env.ACCESS_TOKEN_SECRET,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		url: process.env.DATABASE,
	})
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });


// routes
var usersRouter = require('./components/users/RouteUsers');
var tokensRouter = require('./components/tokens/RoutesToken');
app.use('/users', usersRouter);
app.use('/users', tokensRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
