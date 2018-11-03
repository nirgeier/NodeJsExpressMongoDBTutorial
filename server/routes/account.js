var express = require('express');
var router = express.Router();

router.get('/register', getRegisterationForm);
router.post('/register', register);

router.get('/login', getLoginForm);
router.post('/login', login);

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
    title: "Registration Form"
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
function login(req, res, next) {

}

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
    title: "Registration Form",
    view: "account/register"
  });


}

function validateForm(data) {
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
      errors: errorMessages
    });
  } else {
    data.res.redirect('/');
  }

  // Return undefined if there are no errors
  return errors ? errorMessages : undefined;

}

module.exports = router;