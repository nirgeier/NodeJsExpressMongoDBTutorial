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

