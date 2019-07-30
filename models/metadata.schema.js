var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Comments = new Schema({
    comment: String,
    user: String,
    date: Date
})

var metaDataSchema = new Schema({
  id: { type: String, unique: true, required: true },
  transcript_url: String,
  tags: [String],
  rating: Object,
  status: {type: String, enum: ['processing', 'review', 'published']},
  video_url: String,
  videoTitle: { type: String, required: true },
  description: { type: String, required: true },
  duration: String,
  thumbnailUrl: String,
  slides: [Object],
  code: [Object],
  topics: [Object],
  questions: {
    count: String,
    questions: [Object]
  },
  comments: [Comments]
})




var MetaData = mongoose.model('MetaData', metaDataSchema)
module.exports = MetaData
