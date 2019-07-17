const express = require('express');
const router = express.Router();
const userService = require('../../services/user.service');

// routes
router.post('/authenticate', authenticate);
router.get('/', getAll);
router.post('/signup', registerUser)

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => {
            user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' })
        })
        .catch(err => {
            res.status(400).json({ message: err });
        });
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function registerUser(req, res, next) {
    console.log('registeruser');
    userService.saveUser(req.body)
        .then(user => {
            console.log(user);
            user ? res.json(user) : res.status(200).json({ message: 'User created successfully' })
        })
        .catch(err => next(err));
}