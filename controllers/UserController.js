var mongoose = require('../models/DBConfig');
var UserSchema = mongoose.model('User');

var UserController = function(){
    this.addUser = function(data){
        return new Promise(function(resolve,reject){
            var user = new UserSchema({
                fname : data.fname,
                lname : data.lname,
                email : data.email,
                address : data.address,
                timezone : data.timezone
            });

            user.save().then(function(){
                resolve({status:201, message:'User Added'});
            }).catch(function (err) {
                reject({status:500, message : 'Error - '+ err});
            })
        })
    };

    this.updateUser = function(id, data){
        return new Promise(function(resolve, reject){
            UserSchema.update({_id:id}, data).then(function() {
                resolve({status : 200, message : 'User Updated'});
            }).catch(function(err){
                reject({status : 500, message : 'Error - ' + err});
            })
        })
    },

    this.getAll = function(){
        return new Promise(function (resolve, reject) {
            UserSchema.find().exec().then(function (data) {
                resolve({status:200, message: data});
            }).catch(function(err){
                reject({status:500, message:'Error - '+err});
            })
        })
    }
};
module.exports = new UserController();
