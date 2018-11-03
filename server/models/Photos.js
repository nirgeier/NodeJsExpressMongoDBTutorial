//
// Create the mongooseDB Model
//
// Mongoose provides all the CRUD methods :
//    Photo.create
//    Photo.update
//    Photo.remove
//    Photo.find
//
//  on the model.
var mongoose = require('mongoose');
var colors = require('colors');

// Define the Photos schema
var schema = new mongoose.Schema({
    name: String,
    path: String
});

// Export the model
var Model = mongoose.model('Photo', schema);

module.exports = Model;

// -----------------------------------------------
// ----- TESTS ... TESTS ... TESTS ... TESTS -----
// -----------------------------------------------
/*
// Clear all previous data
Model.remove({}, function (err) {
    console.log(colors.green('Database cleared'));
});

// Add images to the array.
// Each photo has its name and path (it can be local images or url from the internet)
// The images are located in public/images
new Model({
    name: 'Event Loop (png)',
    path: 'eventLoop.png'
}).save();

new Model({
    name: 'Express (jpg)',
    path: 'express.jpg'
}).save();
*/