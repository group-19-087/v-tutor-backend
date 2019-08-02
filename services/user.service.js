const config = require('../config.json')
const jwt = require('jsonwebtoken')

var User = require('../models/user.schema')

module.exports = {
  authenticate,
  getAll,
  saveUser
}

async function authenticate ({ username, password }) {
  console.log(username, password)

  return new Promise((resolve, reject) => {
    User.findOne({
      username: username,
      password: password
    }, (err, res) => {
      let token
      if (err) {
        console.log(err)
        reject(err)
      } else if (res) {
        console.log(res)
        token = jwt.sign({
          id: res._id,
          username: res.username,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          lecturer: res.lecturer,
          profilePictureUrl: res.profilePictureUrl
        }, config.secret)
        resolve({
          token
        })
      } else {
        reject('Username or password is incorrect')
      }
    })
  })
}

async function getAll () {
  return User.find((err, res) => {
    if (err) {
      return err
    } else {
      return res
    }
  })
}

async function saveUser (userdata) {
  const userObj = {
    username: userdata.userForm.username,
    password: userdata.userForm.matchingPasswords.password,
    fullname: userdata.userForm.fullname,
    email: userdata.userForm.email,
    lecturer: userdata.userForm.lecturer,
    birthday: userdata.userForm.birthday,
    gender: userdata.userForm.gender,
    phone: userdata.userForm.countryPhone.phone,
    bio: userdata.userForm.bio,
    profilePictureUrl: "assets/images/users/1.jpg"
  }

  const newUser = new User(userObj)

  return new Promise((resolve, reject) => {
    newUser.save((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
