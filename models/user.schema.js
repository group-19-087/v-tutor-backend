var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    firstname: String,
    lastname: String,
    password: String,
    email: {
        type: String,
        unique: true
    },
    lecturer: Boolean
});

var User = mongoose.model('User', userSchema);
module.exports = User;