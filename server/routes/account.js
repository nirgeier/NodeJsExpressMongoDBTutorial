var express = require('express');
var router = express.Router();
var User = require('../models/Users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/register', getRegisterationForm);
router.post('/register', register);

router.get('/login', getLoginForm);
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    //    failureFlash: 'Invalid username or password.'
    failureFlash: true
  }),
  function (req, res, next) {
    console.log(arguments);
  });

/**
 * The function is a middleware
 *
 * @param req - The request object
 * @param res - The response object
 * @param next
 * 
 */
function getLoginForm(req, res, next) {
  // Render the images gallery
  res.render('account/login', {
    title: "Login Form"
  });
}

/**
 * The function is a middleware
 *
 * @param req - The request object
 * @param res - The response object
 * @param next
 * 
 */
function getRegisterationForm(req, res, next) {
  // Render the images gallery
  res.render('account/register', {
    title: "Registration Form",
    data: {}
  });
}

/**
 * The function is a middleware
 *
 * @param req - The request object
 * @param res - The response object
 * @param next
 * 
 */
function login(req, res, next) {}

/**
 * The function is a middleware
 *
 * @param req - The request object
 * @param res - The response object
 * @param next
 * 
 */
function register(req, res, next) {

  // Check Validation
  req.checkBody('username', 'User name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password min length : 5 characters').notEmpty().isLength({
    min: 5
  });
  req.checkBody('password2', 'Verify password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Validate the register form
  validateForm({
    req: req,
    res: res,
    action: "register",
    title: "Registration Form",
    view: "account/register"
  });

}

function validateForm(data) {
  console.log('validateForm');
  let errors,
    errorMessages;

  // Check to see if we have errors
  errors = data.req.validationErrors();

  // Convert the errors from array to object
  errors && errors.forEach(function (error) {
    // Init the error object
    errorMessages = errorMessages || {};
    errorMessages[error.param] = error;
  });

  // Send the reply
  if (errorMessages) {
    data.res.render(data.view || "/", {
      title: data.title || "",
      errors: errorMessages,
      data: data.req.body
    });
  } else {
    processAction(data);
  }

  // Return undefined if there are no errors
  return errors ? errorMessages : undefined;

}

function processAction(data) {

  switch (data.action) {
    case "login":
      console.log('login');
      break;
    case "register":
      let user = new User(data.req.body);
      User.createUser(user)
        .then(function (err, userRecord) {
          if (!err) {
            data.res.redirect('/');
          }
        });
      break;
  }

}

// serializeUser
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// de-serializeUser
passport.serializeUser(function (id, done) {
  User.findById(id, done);
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log('LocalStrategy');
    User.findOne({
      username: username
    }, function (err, user) {

      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }

      User.comparePasswords(password, user.password,
        function (err, isMatch) {
          console.log('User found, isMatch:', isMatch);
          if (err)
            throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Wrong password"
            });
          }

        }); //  User.comparePasswords
    });
  }
));
module.exports = router;