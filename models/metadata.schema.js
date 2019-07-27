var mongoose = require('mongoose')
var Schema = mongoose.Schema

var lectureDataSchema = new Schema({
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
  comments: [Object]
})


var LectureData = mongoose.model('LectureData', lectureDataSchema)
module.exports = LectureData
