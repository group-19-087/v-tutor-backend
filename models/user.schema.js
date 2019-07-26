var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },    
    email: {
        type: String,
        unique: true,
        required: true
    },
    lecturer: {
        type: Boolean,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    bio: {
        type: String
    }
});

var User = mongoose.model('User', userSchema);
module.exports = User;