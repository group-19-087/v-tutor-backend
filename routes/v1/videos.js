var express = require('express')
var router = express.Router()
var multer = require('multer')
var AWS = require('aws-sdk')
var multerS3 = require('multer-s3')
var frameController = require('../../frames/frameController')
var videoController = require('../../controllers/video.controller')
var metaDataService = require('../../services/metadata.service')
var ocrService = require('../../services/ocr.service')
var extractFrames = frameController.extract
var uploadThumbnail = frameController.uploadThumbnail

require('dotenv').config()

const s3bucket = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.AWS_REGION
})

// var upload = multer({
//   storage: multerS3({
//     s3: s3bucket,
//     bucket: process.env.BUCKET_NAME,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     acl: 'public-read',
//     metadata: function(req, file, cb) {
//       cb (null, {fieldName: file.fieldname});
//     },
//     key: function(req, file, cb) {
//       console.log(req.body);
//       cb (null, req.body.lectureId + "/" + file.originalname);
//     },

//   })
// });

var uploadToS3 = function (req, res, next) {
  var upload = multer({
    storage: multerS3({
      s3: s3bucket,
      bucket: process.env.BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname })
      },
      key: function (req, file, cb) {
        console.log(req.body)
        if (file.fieldname === 'lectureVideo') {
          cb(null, req.body.lectureId + '/' + file.originalname)
        } else if (file.fieldname === 'codeFiles') {
          cb(null, req.body.lectureId + '/code_files/' + file.originalname)
        } else if (file.fieldname === 'lectureSlides') {
          cb(null, req.body.lectureId + '/lecture_slides/' + file.originalname)
        }
      }

    })
  }).any()

  upload(req, res, function (err) {
    if (err) {
      res.status(500).json({ err: err })
    } else {
      metaDataService.saveMetaData({
        id: req.body.lectureId,
        videoTitle: req.body.lectureName,
        description: req.body.lectureDescription
      })
      next()
    }
  })
}

router.get('/', function (req, res, next) {
  res.send('route to get video resources')
})

// router.post('/upload', upload.single('file'), function (req, res, next) {
//     res.send('Successfully uploaded ' + req.file.length + ' files!');
// })

router.post('/upload', uploadToS3, function (req, res, next) {
  res.status(200).json({ response: 'Successfully uploaded files' })
})

// router.post('/upload', upload.single('file'), function (req, res, next) {
//   res.send('Successfully uploaded ' + req.file.length + ' files!');
// })

router.post('/notifyuploaded', function (req, res, next) {
  const msgType = req.get('x-amz-sns-message-type')
  if (msgType == null) {
    console.log('x-amz-sns-message-type header not found')
    res.send('x-amz-sns-message-type header not found')
  } else {
    console.log(msgType)
    if (msgType === 'SubscriptionConfirmation') {
      console.log('This is a subscription confirmation message')
      console.log('URL : ' + req.body.SubscribeURL)
      res.send('Notify Uploaded Endpoint called')
    } else if (msgType === 'Notification') {
      const message = JSON.parse(req.body.Message)
      const bucket = message.Records[0].s3.bucket.name
      const key = message.Records[0].s3.object.key

      console.log('SNS notification received')
      console.log('Bucket : ' + bucket)
      console.log('Object key : ' + key)
      // finish http request so it is non-blocking for SNS
      res.status(200).send('Notify Uploaded Endpoint called')

      videoController.updateVideoURL(key);

      // Then handle frame extraction
      extractFrames(bucket, key).then((data) => {
        console.log('extract frames promise data : ' + data)
        uploadThumbnail(bucket, key)
        ocrService.runOCR().then((data) => {
          console.log("ocr promise data : " + data)
        }).catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }
})

module.exports = router
