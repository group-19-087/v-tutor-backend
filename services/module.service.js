var Module = require('../models/module.schema')

module.exports = {
  addNewTag,
  getAllTags
}
  

async function getAllTags() {
    return Module.find((err, res) => {
        if (err) {
            return err
        } else {
            return res
        }
    })
}

async function addNewTag(tag) {
    const newModule = Module(tag)
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