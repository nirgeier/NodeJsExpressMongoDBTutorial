/**
 * This file will contain the data for our photos application
 **/
var Photos = require('../models/Photos');
var path = require('path');
var fs = require('fs');
var join = path.join;

/**
 * This method will render out the images
 * The funciton is a middleware
 *
 * @param req - The request object
 * @param res - The response object
 * @param next
 * 
 */
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

/**
 * Get the upload form
 * @param req
 * @param res
 * @param next
 */
function getUploadForm(req, res, next) {
  res.render('photos/upload', {
    title: 'Photo upload form'
  });
}

/**
 * The submit for (upload) action
 *
 * @param dir - The directory to save the images to
 * @returns {Function}
 */
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

/**
 *
 * @param dir
 * @returns {Function}
 */
function downloadImage(dir) {

  return function (req, res, next) {

    // Get the image id
    var id = req.params.id;

    // find the image in the DB
    Photos.findById(id,
      function (err, photo) {
        if (err) {
          return next(err);
        }
        // get the image path
        var path = join(dir, photo.path);

        // Download the image name
        res.download(path, photo.name + '.jpeg');
      });
  };
}

// Expose the public methods
module.exports = {
  listImages: listImages,
  uploadImage: uploadImage,
  downloadImage: downloadImage,
  getUploadForm: getUploadForm
};