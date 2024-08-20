var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('./config/passport');
const flash = require('express-flash');
const UsersMiddleware = require('./middleware/activeUsers');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const http = require('http');
const { initGameSocket } = require('./sockets/gameSocket');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gamesRouter = require('./routes/games');

var app = express();
const server = http.createServer(app);
initGameSocket(server);
server.listen(3002, () => {
  console.log('Server is running on port 3000');
});
app.use(flash());
// Middleware
const uri = process.env.DATABASE_URL;
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: uri,
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60,
      autoRemove: 'native',
    }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(UsersMiddleware.activeUsersMiddleware);

// Use the CORS middleware
app.use(cors({ origin: 'https://cryptorps-warriors.netlify.app', credentials: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/failure', indexRouter);
app.use('/users', usersRouter);
app.use('/games', gamesRouter);

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
});

module.exports = app;
