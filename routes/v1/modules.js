const express = require('express')
const router = express.Router()
const monduleController = require('../../controllers/module.controller')

module.exports = router

router.post('/', addModule)
router.get('/', getAll)
router.put('/', updateModule)

function addModule (req, res, next) {
    console.log('tags add tag');
    return monduleController.addNewTag(req, res, next)
}

function getAll (req, res, next) {
    console.log('tags get all');
    return monduleController.getAllTags(req, res, next)
}

function updateModule (req, res, next) {
    console.log('update Module');
    console.log(req.query);
    return monduleController.updateModule(req, res, next)
}