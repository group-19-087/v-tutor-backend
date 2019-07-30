var mongoose = require('mongoose')
var Schema = mongoose.Schema

var moduleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    createdBy: { type: Schema.Types.ObjectId },
    dateCreated: { type: Date, default: Date.now() },
    description: { type: String }
})

moduleSchema.pre('save', function (next) {
    return new Promise(async (resolve, reject) => {
      const moduleExists = await Module.findOne({ name: this.get('name') })
        .then(doc => { return doc ? true : false })
        .catch(err => reject(err))
  
      if (moduleExists) {
        const err = { moduleExists: moduleExists }
        reject(err)
      } else {
        resolve()
      }
    })
  })

  // moduleSchema.pre('findOneAndUpdate', function (next) {
  //   return new Promise(async (resolve, reject) => {
  //     const moduleExists = await Module.findOne({ name: this.get('name') })
  //       .then(doc => { return doc ? true : false })
  //       .catch(err => reject(err))
  
  //     if (moduleExists) {
  //       const err = { moduleExists: moduleExists }
  //       reject(err)
  //     } else {
  //       resolve()
  //     }
  //   })
  // })

var Module = mongoose.model('Module', moduleSchema)
module.exports = Module