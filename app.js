var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();


const passport = require('./utils/passport')
const { expressjwt: jwt } = require('express-jwt')


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

app.use(passport.initialize());

// jwt
app.use(
  jwt({
    secret: process.env.JWT_SECRET_KEY, 
    algorithms: ["HS256"],
    getToken: (req) => {
      if(req.headers.authorization){
        return req.headers.authorization;
      }
      if(req.cookies['authorization']){
        return req.cookies['authorization'];
      }
      return null;
    },
    onExpired: async (req, err) => {
      if (new Date() - err.inner.expiredAt < 5000) { return;}
      throw err;
    }
  }).unless({
    path: ['/login', '/auth/**']
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chatgpt', chatgptRouter);
app.use('/auth', oauthRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
    return;
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
