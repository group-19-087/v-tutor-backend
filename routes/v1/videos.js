var express = require('express');
var router = express.Router();
var multer  = require('multer');
var AWS = require('aws-sdk');
var multerS3 = require('multer-s3');

require('dotenv').config()

let s3bucket = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: process.env.AWS_REGION
});

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
      metadata: function(req, file, cb) {
        cb (null, {fieldName: file.fieldname});
      },
      key: function(req, file, cb) {
        console.log(req.body);
        cb (null, req.body.lectureId + "/" + file.originalname); 
      },
  
    })
  }).any();

  upload (req, res, function (err) {
    if (err) {
      res.status(500).json({err: err});
    } else {
      next();
    }
  })
}

router.get('/', function(req, res, next) {
  res.send('route to get video resources');
});

// router.post('/upload', upload.single('file'), function (req, res, next) {
//     res.send('Successfully uploaded ' + req.file.length + ' files!'); 
// })

router.post('/upload', uploadToS3, function (req, res, next) {
  res.status(200).json({response: 'Successfully uploaded files'});
})



module.exports = router;
