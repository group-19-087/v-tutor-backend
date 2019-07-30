const moduleService = require('../services/module.service')

exports.getAllTags = function (req, res, next) {
  moduleService.getAllTags()
        .then(tags => res.json(tags))
        .catch(err => next(err))
}

exports.addNewTag = function (req, res, next) {
  moduleService.addNewTag(req.body)
      .then(tag => res.status(201).json({ message: 'Module added successfully' }))
      .catch(err => {
        next(err)
      })
  }
  