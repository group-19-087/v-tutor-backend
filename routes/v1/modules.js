const express = require('express')
const router = express.Router()
const monduleController = require('../../controllers/module.controller')

module.exports = router

router.get('/:id', getModuleContent)
router.post('/', addModule)
router.get('/', getAll)
router.put('/', updateModule)

function addModule (req, res, next) {
    return monduleController.addNewTag(req, res, next)
}

function getAll (req, res, next) {
    return monduleController.getAllTags(req, res, next)
}

function updateModule (req, res, next) {
    return monduleController.updateModule(req, res, next)
}

function getModuleContent (req, res, next) {
    return monduleController.getModuleContent(req, res, next)
}