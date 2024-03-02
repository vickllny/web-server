var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatgptRouter = require('./routes/chatgpt');
var oauthRouter = require('./routes/oauth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chatgpt', chatgptRouter);
app.use('/auth', oauthRouter);

const port = process.env.PORT || 3000;

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
  res.render('error');
});

passport.use(new GitHubStrategy({
    clientID: process.env.OAUTH_GITHUB_CLIEND_ID,
    clientSecret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
    callbackURL: `http://127.0.0.1:${port}/auth/github/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    // 在这里，你可以根据 profile 信息查找或创建用户
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


module.exports = app;
