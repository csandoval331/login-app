var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var redis = require('redis')
var redisStore = require('connect-redis')(session)
var client = redis.createClient('redis://redis_db:6379')
// var client = redis.createClient()
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var uuid = require('uuid').v4

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login')
var registerRouter = require('./routes/register')
var logoutRouter = require('./routes/logout')

mongoose.connect('mongodb://mongo/userlogin',{
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(console.log("successfully connected to db"))

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  genid: (req)=>{
    return uuid();
  },
  secret:'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge:2592000000},
  store:new redisStore({host:'redis_db',port:6379,client:client, ttl:260})
  
}))
app.use(passport.initialize() );
app.use(passport.session() );
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css',express.static(path.join(__dirname,'node_modules/bootstrap/dist/css') ))
app.use('/js',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')))
app.use('/js',express.static(path.join(__dirname,'node_modules/jquery/dist')))
app.use('/js',express.static(path.join(__dirname,'node_modules/@popperjs/core/dist/umd/')))


passport.serializeUser((user,done)=>{
  console.log("serialize",user)
  user = JSON.parse(JSON.stringify(user))
  delete user.password
  done(null, user)
})
passport.deserializeUser((id,done)=>{
  console.log("deserialize",id)
  User.findById(id,(err, user)=>{
    console.log("inside deserialize",user)
    // res.locals = {username:user.username};
    // app.session.user = user
    done(err,user)
  })
})
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("inside local strategy");
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register',registerRouter);
app.use('/logout', logoutRouter);

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

module.exports = app;
