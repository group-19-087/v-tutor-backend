const express = require('express')
const router = express.Router()
const userService = require('../../services/user.service')
const userController = require('../../controllers/users.controller')

// routes
router.post('/authenticate', authenticate)
router.get('/', getAll)
router.post('/signup', registerUser)

module.exports = router

function authenticate (req, res, next) {
  userService.authenticate(req.body)
    .then(user => {
      user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' })
    })
    .catch(err => {
      res.status(400).json({ message: err })
    })
}

function getAll (req, res, next) {
  userService.getAll()
    .then(users => res.json(users))
    .catch(err => next(err))
}

function registerUser (req, res, next) {
  console.log('USER SERVICE : registeruser')
  return userController.saveUser(req, res, next)
}
