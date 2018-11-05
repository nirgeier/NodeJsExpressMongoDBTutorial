# Express Photo Application

### Step 01 - Install pre-requirments

### Pre requirements
* [NodeJS](https://nodejs.org/)
* [Git](https://git-scm.com/downloads)
* [MongoDB](https://www.mongodb.org/downloads)

### Visual Studio 
* **Install the mongoDB plugin:** [Azure Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
* Add mongo to your VS Code path in your `settings.json`
```
  mongo.shell.path : ...
```

### Connecting to the DB
* Create folder named `data` in your project root folder
  - This folder will contain all the mongoDB files
* Copy the `mongod.conf` to your local project folder
* Check the connection to your db
  - Windows: `mongod.bat` (Edit the file and set the path to your `mongod.exe`)
  - Unix based: `mongod.sh`

----------------------------------------
### Step 02 - Create Application Skelton

* Install global Node packages which will be used in this tutorial
```sh 
  npm install -g grunt-cli express express-generator nodemon
```
* Create a NodeJS project 
```sh
  npm init -f 
```
* Create the server folder structure
```sh
  mkdir server
  mkdir server/models
  mkdir server/public
  mkdir server/routes
  mkdir server/views
  touch server/app.js
```

* Create a server as a NodeJS project 
```sh
  cd server && npm init -f
```

* Install the following dependencies **inside the server folder** 

```bash
  npm i bcryptjs body-parser colors connect-flash cookie-parser debug ejs express express-messages
  express-session express-validator mongodb mongoose multer passport passport-http passport-local winston
```

-----------------------------------------------
### Step03 - Building the Express server
Copy **[`server/app.js`](/server/app.js)** to your app folder.

The file contains the following:
  - imports for all the requirements
  - minimal server listening on the given port. 
  - Middlewares


```js
// The required dependencies for our project
var path = require('path');
var mongo = require('mongodb');
var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
const SERVER_PORT = process.env.PORT || 3000;

// Init The express app
var app = express();

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// DB Init
mongoose.connect('mongodb://localhost/node_tutorial', {
  useNewUrlParser: true
});

// Set up View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Add Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

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

// Set the default route 
app.use('/', function (req, res, next) {
  res.send("Server is running.....");
})

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
  console.log('Server listening on port ' + app.get('port'));
});
```
* Start the server
``` bash
cd server
nodemon app.js
```
* Open your browser: http://localhost:3000 to verify that the server is running

----------------------------------------
### Step04 - Adding Routes And Views

- Copy the ocntent of the public folder to the `server/public` folder.
- Create **[`server/routes/photos.js`](/server/routes/photos.js)** and add a list function to list (display) the images
```js
  function listImages(req, res, next) {
    // Render the images gallery
    res.render('photos', {
      title: 'Photos',
      photos: []
    });
  }

  // Expose the public methods
  module.exports = {
    listImages: listImages
  }
```
- Create **[`server/views/photos/index.ejs`](/server/views/photos/index.ejs)** which will be served as our HTML page to display the images
```html
<h1>Photos application</h1>
```
- Edit **[`server/app.js`](/server/app.js)** and add the foloowing:
  - photos router as required module
  - default route should be mapped to `photos/listImages`
```js
...
// Load routers
var photos = require("./routes/photos");
...
// Set the default route 
app.use('/', photos.listImages);
...
```
----------------------------------------
### Step05 - Adding MongoDB
- Make sure mongo is up and runnig.
  - If you are using visual studio click on the `Azure Cosmos DB` icon and connect to the local DB
    - Click on the `plug` icon
    - Choose MongoDb from the drop down menu
    - Type: `mongodb://127.0.0.1:27017`
  - Now you should see the databases under your local instance  
- Create [`server/models/Photos.js`](`/server/models/Photo.js`) with the photos model
```js
var mongoose = require('mongoose');

// Define the Photos schema
var schema = new mongoose.Schema({
    name: String,
    path: String
});

// Export the model
var Model = mongoose.model('Photo', schema);

module.exports = Model;
```

- Add the `models/Photos.js` to **[`server/views/photos/index.ejs`](/server/views/photos/index.ejs)**
```js
var Photos = require('../models/Photos');
```
- Update the `exports.listImages` to fetch the images from the mongod db
```js
function listImages(req, res, next) {
  // Use the mongoose to find all the images in the model
  Photos.find({}, // Find all images
    function (err, photos) {

      // Check for error
      if (err) {
        return next(err);
      }

      // Render the images gallery
      res.render('photos', {
        title: 'Photos',
        photos: photos
      });
    });
}
```
* Update the **[`server/views/photos/index.ejs`](/server/views/photos/index.ejs)** to display the images

----------------------------------------
### Step06 - Upload Images
- Creating a photo upload form **[`server/views/photos/upload.ejs`](/server/views/photos/upload.ejs)**
- Update **[`server/views/templates/head.ejs`](/server/views/templates/head.ejs)** (Navigation)
```html
<a class="nav-link" href="/upload">Upload</a>
```
- Set the upload folder in `server/app.js`
```js
// Set the upload images directory
app.set('photos', path.join(__dirname + '/public/images'));
```
- Add the following code to the **[`server/routes/photos.js`](/server/routes/photos.js)**
```js
...
// Add the required modules
var path = require('path');
var fs = require('fs');
var join = path.join;

...

// Function to get the upload form
function getUploadForm(req, res, next) {
  res.render('photos/upload', {
    title: 'Photo upload form'
  });
};

// Function to handle the upload
function uploadImage(dir) {

  // This is middleware so we have the middleware parameters
  // The file are already parsed with the parseBody middleware
  return function (req, res, next) {

    var img = req.file, // Get the images - if any
      name = img.originalname, // Get the image name
      path = join(dir, img.originalname); // Set the path where to store the image = dir+imgName

    // Use the fs module to create and save the file
    fs.rename(
      img.path, // Old path
      path, // New path
      function (err) { // callback

        // Check to see if there wa any error while trying to move the image around
        if (err) {
          return next(err);
        }

        // Add the Photo to our DB 
        Photos.create({
            name: name,
            path: name
          },
          function (err) {
            // If there was an error while trying to add the image to the model
            // "skip" to the next middleware
            if (err) {
              return next(err);
            }
            // Display the images gallery page
            res.redirect('/');
          });
      });

  };
}

...
// Expose the public methods
module.exports = {
  listImages: listImages,
  uploadImage: uploadImage,
  getUploadForm: getUploadForm
};
```
- Add the new routes (`get` & `post`) to `server/app.js`
```js
app.get('/upload', photos.getUploadForm);
app.post('/upload', photos.uploadImage(app.get('photos')));
```
- Add the code in the `app.js` to "grab" the image. In this demo we will be using `multer`
```js
var multer = require('multer');
...
app.use(multer({dest: './uploads/'}).single('photo'));
```
----------------------------------------
### Step07 - Download Images
- Update the [`server/routes/photo.js`](/server/routes/photo.js) with the download method
```js
function downloadImage(dir) {

    return function(req, res, next) {

        // Get the image id from the url
        var id = req.params.id;

        // find the image in the DB
        Photos.findById(id,
            function(err, photo) {
                if (err) {
                    return next(err);
                }
                // get the image path
                var path = join(dir, photo.path);

                // Download the image name
                res.download(path, photo.name + '.jpeg');
            });
    };
};

...
// Expose the public methods
module.exports = {
  ...
  downloadImage: downloadImage
  
};
```
- Add the new routes to `app.js`
```js
// Add the download middleware
// The id is passed as parameter in the url
app.get('/photo/:id/download', photos.download(app.get('photos')));
```
- Update the view to support the download method

----------------------------------------
### Step08 - Adding logger (Winston)
- Install the reuired packages **Inside the server folder**
```
npm i morgan winston app-root-path
```
- Create a new file [**`server/logger.js`**](/server/logger.js)
```js
const appRoot = require('app-root-path');
const winston = require('winston');
const path = require('path');


// define the custom settings for each transport (file, console)
var options = {
    debug: {
        level: 'debug',
        name : 'debug',
        filename: `${appRoot}/logs/log.log`,
        handleExceptions: true,
        json: false,
        maxsize: 5242880, // 5MB
        maxFiles: 100,
        colorize: true
    },
    error: {
        level: 'error',
        name : 'error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        json: false,
        maxsize: 5242880, // 5MB
        maxFiles: 100,
        colorize: true
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
    }
};

// instantiate a new Winston Logger with the settings defined above
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console(options.console),
        new winston.transports.File(options.debug),
        new winston.transports.File(options.error)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    }
};

module.exports = logger;
```
- Add the logger to the `app.js`
```js
var logger = require('./logger');
var morgan = require('morgan');
...
app.use(morgan('combined', { stream: logger.stream }));

```
----------------------------------------
### Step09 - Adding Login/Register Routes & Views 

- In this step we will add a login & register routes & views

- Create the new account router: **[server/routes/account.js]**(server/routes/account.js)
```js 
var express = require('express');
var router = express.Router();
var logger = require('./../logger');

// The router methods
router.get('/login', getLoginForm);
router.get('/register', getRegisterationForm);
router.post('/login', login);
router.post('/register', register);
 
// --------------------------------
// Copy the content of the file 
// --------------------------------

module.exports = router; 
```

- Copy the login & register templates
  - [**server/views/account/register.ejs**](/server/views/account/register.ejs)
  - [**server/views/account/login.ejs**](/server/views/account/login.ejs)

- Add the new route to the `app.js`
```js
var account = require("./routes/account");

... 
// Handle the login/register.
// The routes themself are in the router itself
app.use('/account', account);
```

----------------------------------------
### Step10 - Register User