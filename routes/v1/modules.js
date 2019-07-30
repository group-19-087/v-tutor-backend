const express = require('express')
const router = express.Router()
const monduleController = require('../../controllers/module.controller')

module.exports = router

router.post('/', addTag)
router.get('/', getAll)

function addTag (req, res, next) {
    console.log('tags add tag');
    return monduleController.addNewTag(req, res, next)
}

function getAll (req, res, next) {
    console.log('tags get all');
    return monduleController.getAllTags(req, res, next)
}