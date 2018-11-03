/**
 * This file will contain the data for our photos application
 **/

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