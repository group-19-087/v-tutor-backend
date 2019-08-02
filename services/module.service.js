var Module = require('../models/module.schema')
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = {
  addNewModule,
  getAllModules,
  updateModule,
  getModuleById
}


async function getAllModules() {
  return Module.find((err, res) => {
    if (err) {
      return err
    } else {
      return res
    }
  })
}

async function addNewModule(module) {
  const newModule = Module(module)
  return new Promise((resolve, reject) => {
    newModule.save((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

async function updateModule(id, module) {
  return new Promise((resolve, reject) => {
    Module.findOneAndUpdate({ _id: id }, module, ((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    }))
  })
}

async function getModuleById(moduleId, projection) {
  if (projection) {
    return new Promise((resolve, reject) => {
      Module.find({ _id: new ObjectId(moduleId) }, projection, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      Module.find({ _id: new ObjectId(moduleId) }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}