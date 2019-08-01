var mongoose = require('mongoose');
var schema = mongoose.Schema;

var UserSchema = new schema({
    fname : {type : String, required : true},
    lname : {type : String, required : true},
    email : {type : String, required  : true},
    address : {type : String, required : false},
    timezone : {type : String, required : true}
});
mongoose.model('User', UserSchema);
mongoose.connect('mongodb://127.0.0.1:27017/usertab', function(err){
    if(err){
    console.log(err);
    process.exit(-1);
}
console.log('Connected to DB');
});
module.exports = mongoose;
