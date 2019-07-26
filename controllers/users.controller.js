const userService = require('../services/user.service')

exports.authenticate = function (req, res, next) {
  userService.authenticate(req.body)
    .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
    .catch(err => next(err))
}

exports.getAll = function (req, res, next) {
  userService.getAll()
    .then(users => res.json(users))
    .catch(err => next(err))
}

exports.saveUser = function (req, res, next) {
  userService.saveUser(req.body)
    .then(user => res.status(201).json({ message: 'User registered successfully' }))
    .catch(err => {
      if (err.userExists) {
        res.status(422).json({ username: 'Username is already taken' })
      } else if (err.emailExists) {
        res.status(422).json({ email: 'Email is already exists' })
      }
      next(err)
    })
}
