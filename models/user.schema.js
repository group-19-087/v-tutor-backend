var mongoose = require('mongoose')
var Schema = mongoose.Schema

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
  country: {
    type: String
  },
  phone: {
    type: String
  },
  bio: {
    type: String
  },
  profilePictureUrl: String
})

userSchema.pre('save', function (next) {
  return new Promise(async (resolve, reject) => {
    const userExists = await User.findOne({ username: this.get('username') })
      .then(doc => { return doc ? true : false })
      .catch(err => reject(err))

    const emailExists = await User.findOne({ email: this.get('email') })
      .then(doc => { return doc ? true : false })
      .catch(err => reject(err))

    if (userExists) {
      const err = { userExists: userExists }
      reject(err)
    } else if (emailExists) {
      const err = { emailExists: emailExists }
      reject(err)
    } else {
      resolve()
    }
  })
})

var User = mongoose.model('User', userSchema)
module.exports = User
