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

var Transcript = new Schema({
    paragraph: String,
    time: String,
    seconds: Number
});

var slide = new Schema({
    slide: String,
    timestamp: Number
});

var statusSchema = new Schema({
  status: { type: String, enum: ['processing', 'review', 'published'] },
  code: { type: String, enum: ['processing', 'done'] },
  slides: { type: String, enum: ['processing', 'done'] },
  topics: { type: String, enum: ['processing', 'done'] },
  questions: { type: String, enum: ['processing', 'done'] },
});

var metaDataSchema = new Schema({
  id: { type: String, unique: true, required: true },
  transcript_url: String,
  tags: [String],
  rating: Object,
  status: statusSchema,
  video_url: String,
  videoTitle: { type: String, required: true },
  description: { type: String, required: true },
  duration: String,
  thumbnailUrl: String,
  slides: [slide],
  code: [Object],
  topics: [Topic],
  questions: {
    count: String,
    questions: [Object]
  },
  comments: [Comment],
  module: { type: Schema.Types.ObjectId },
  date: { type: Date, default: Date.now() },
  owner: { type: Schema.Types.ObjectId },
  transcript : [Transcript]
})

const index = { tags: 'text' };
metaDataSchema.index(index);


var MetaData = mongoose.model('MetaData', metaDataSchema)
module.exports = MetaData
