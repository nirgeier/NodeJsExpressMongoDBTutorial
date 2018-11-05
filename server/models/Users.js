var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var colors = require('colors');

// Define the Photos schema
var UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    email: String,
    password: String
});

// Export the model
var Users = mongoose.model('Users', UsersSchema);

module.exports = Users;

// Add the create user method
module.exports.createUser = function (newUser) {
    return new Promise(function (resolve, reject) {

        // Docs: https://www.npmjs.com/package/bcryptjs#usage---async
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                if (err) {
                    reject(err);
                }
                // Scramble the password 
                newUser.password = hash;
                newUser.save(resolve);
            });
        });
    });

}

/**
 * Compare the given password to the one in the one in DB
 */
module.exports.comparePasswords = function (password, hashedPassword, cb) {
    return bcrypt.compare(password, hashedPassword, cb);
}