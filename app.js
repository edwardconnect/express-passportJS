var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

import cors from 'cors';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
import authRouter from './routes/auth';

import mongoose from 'mongoose';
import passport from 'passport';
import Account from './models/account';
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwtConfig from './configs/jwt';
import './middlewares/passport';
// import LocalStrategy from 'passport-local'

var app = express();

app.use(cors())
// passport js
app.use(passport.initialize());
app.use(passport.session())
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
// passport.use(new LocalStrategy(Account.authenticate()));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
})



// mongoose
mongoose.connect('mongodb://127.0.0.1:27017/playground', {
  useNewUrlParser: true
})

module.exports = app;
