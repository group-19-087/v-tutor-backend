var mongoose = require('mongoose')
var Schema = mongoose.Schema

var moduleSchema = new Schema({
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId },
    dateCreated: { type: Date, default: Date.now() }
})

var Module = mongoose.model('Module', moduleSchema)
module.exports = Module