// The required dependencies for our project
var path = require('path');
var mongo = require('mongodb');
var colors = require('colors');
var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var multer = require('multer');
const SERVER_PORT = process.env.PORT || 3000;
var logger = require('./logger');
var morgan = require('morgan');

// Load routers
var photos = require("./routes/photos");
var account = require("./routes/account");

// Init The express app
var app = express();

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Logger
app.use(morgan('combined', {
  stream: logger.stream
}));

// DB Init
mongoose.connect('mongodb://127.0.0.1/node_tutorial', {
    useNewUrlParser: true
  },
  function (err) {
    err ?
      console.log(colors.yellow.inverse("\n\n" +
        "--------------------------------------------\n" +
        "-- Error Connecting to mongodb database.  --\n" +
        "-- Verify that mongod is running.         --\n" +
        "--------------------------------------------\n")) :
      console.log("\nConnected to local mongoDB.".yellow);

  });

// Set up View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setthe photos folder
app.set('photos', path.join(__dirname + '/public/images'));

// Add Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

// Add validation middleware
app.use(expressValidator());

app.use(multer({
  dest: './uploads/'
}).single('photo'));

// Express Session Middleware
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 600000 // 10 minutes
  }

}));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Set the upload route 
app.get('/upload', photos.getUploadForm);
app.post('/upload', photos.uploadImage(app.get('photos')));

// Add the download middleware
// The id is passed as parameter in the url
app.get('/photo/:id/download', photos.downloadImage(app.get('photos')));

// Handle the login/register
app.use('/account', account);

// Set the default route 
app.use('/', photos.listImages);


// The flash is a special area of the session used for storing messages. 
// Flash was removed in Express 3.X 
// Messages are written to the flash and cleared after being displayed to the user
app.use(flash());

// Collect Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Set Port
app.set('port', SERVER_PORT);

// Start the server
app.listen(app.get('port'), function () {
  console.log(colors.yellow('Server listening on port ' + app.get('port')));
});