/**
 * This file will contain the data for our photos application
 **/
var Photos = require('../models/Photos');

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


// Expose the public methods
module.exports = {
  listImages: listImages
};