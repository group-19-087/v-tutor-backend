const moduleService = require('../services/module.service')

exports.getAllTags = function (req, res, next) {
  moduleService.getAllModules()
    .then(tags => res.json(tags))
    .catch(err => next(err))
}

exports.addNewTag = function (req, res, next) {
  moduleService.addNewModule(req.body)
    .then(tag => res.status(201).json({ message: 'Module added successfully' }))
    .catch(err => {
      if (err.moduleExists) {
        res.status(422).json({ error: 'Module is already exists' })
      }
      next(err)
    })
}

exports.updateModule = function (req, res, next) {
  moduleService.updateModule(req.query.moduleId, req.body)
    .then(module => res.status(200).json({ message: 'Module updated successfully' }))
    .catch(err => {
      next(err)
    })
}
