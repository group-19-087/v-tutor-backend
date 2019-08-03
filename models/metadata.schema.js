var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Comment = new Schema({
    comment: String,
    user: String,
    date: String,
    picUrl: String
});

var Topic = new Schema({
    keywords: [String],
    topic: String,
    time: String
});

var metaDataSchema = new Schema({
  id: { type: String, unique: true, required: true },
  transcript_url: String,
  tags: [String],
  rating: Object,
  status: { type: String, enum: ['processing', 'review', 'published'] },
  video_url: String,
  videoTitle: { type: String, required: true },
  description: { type: String, required: true },
  duration: String,
  thumbnailUrl: String,
  slides: [Object],
  code: [Object],
  topics: [Topic],
  questions: {
    count: String,
    questions: [Object]
  },
  comments: [Comment],
  module: { type: Schema.Types.ObjectId },
  date: { type: Date, default: Date.now() },
  owner: { type: Schema.Types.ObjectId }
})

const index = { tags: 'text' };
metaDataSchema.index(index);


var MetaData = mongoose.model('MetaData', metaDataSchema)
module.exports = MetaData
