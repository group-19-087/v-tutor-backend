const config = require("../config.json");
const jwt = require("jsonwebtoken");

var user = require("../models/user.schema");

// users hardcoded for simplicity, store in a db for production applications
const users = [
    {
        id: 1,
        username: "user1",
        password: "pass1",
        firstName: "Test",
        lastName: "User",
        email: "test@email.com"
    }
];

module.exports = {
    authenticate,
    getAll,
    saveUser
};

async function authenticate({ username, password }) {
    console.log(username, password);

    return new Promise((resolve, reject) => {
        user.findOne({
            username: username,
            password: password
        }, (err, res) => {
            let token;
            if (err) {
                console.log(err);
                reject(err);
            } else if (res) {
                console.log(res);
                token = jwt.sign({
                    username: res.username,
                    firstName: res.firstName,
                    lastName: res.lastName,
                    email: res.email,
                    lecturer: res.lecturer
                }, config.secret);
                resolve({
                    token
                })
            } else {
                reject('Username or password is incorrect')
            }
        })
    })
}



async function getAll() {
    return user.find((err, res) => {
        if (err) {
            return err;
        } else {
            return res;
        }
    });
}

async function saveUser(userdata) {
    const newUser = new user(userdata);

    console.log(userdata);
    

    return new Promise((resolve, reject) => {
        newUser.save((err, res) => {
            if (err) {
                reject(err);
            } else {
                token = jwt.sign({
                    username: res.username,
                    firstName: res.firstName,
                    lastName: res.lastName,
                    email: res.email,
                    lecturer: res.lecturer
                }, config.secret);
                resolve({
                    
                    token
                });
            }
        });
    })
    
}
