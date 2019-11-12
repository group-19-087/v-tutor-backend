var express = require('express');
var router = express.Router();
var multer = require('multer');
var AWS = require('aws-sdk');
var multerS3 = require('multer-s3');
var videoController = require('../../controllers/video.controller');
var metaDataService = require('../../services/metadata.service');
var questiongenerationService = require('../../services/questiongeneration.service');
const jobsService = require('../../services/jobs.service');

const axios = require('axios');

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
    questiongenerationService.generateQuestions(req.body.lectureId, req.body.keyword) // change lectureName to keyworkd
    if (err) {
      res.status(500).json({ err: err })
    } else {
      metaDataService.saveMetaData({
        id: req.body.lectureId,
        videoTitle: req.body.lectureName,
        description: req.body.lectureDescription,
        tags: [],
        rating: {
          likes: [],
          dislikes: []
        },
        status: 'processing',
        slidesStatus: 'processing',
        topicsStatus: 'processing',
        codeStatus: 'processing',
        questionsStatus: 'processing',
        slides: [],
        code: [],
        topics: [],
        questions: {
          count: "",
          questions: []
        },
        comments: []
      })
      next()
    }
  })
}

router.get('/', function (req, res, next) {

  res.send('route to get video resources');

});

// router.post('/upload', upload.single('file'), function (req, res, next) {
//     res.send('Successfully uploaded ' + req.file.length + ' files!'); 
// })

router.post('/upload', uploadToS3, function (req, res, next) {

  res.status(200).json({ response: 'Successfully uploaded files' });

})

router.post('/notifyuploaded', function (req, res, next) {
  const msgType = req.get('x-amz-sns-message-type')
  if (msgType == null) {

    console.log('x-amz-sns-message-type header not found');
    res.send('x-amz-sns-message-type header not found');

  } else {
    console.log(msgType)
    if (msgType === 'SubscriptionConfirmation') {

      console.log('This is a subscription confirmation message');
      console.log('URL : ' + req.body.SubscribeURL);
      res.send('Notify Uploaded Endpoint called');

    } else if (msgType === 'Notification') {

      const message = JSON.parse(req.body.Message);
      const bucket = message.Records[0].s3.bucket.name;
      const key = message.Records[0].s3.object.key;

      console.log('SNS notification received');
      console.log('Bucket : ' + bucket);
      console.log('Object key : ' + key);

      // finish http request so it is non-blocking for SNS
      res.status(200).send('Notify Uploaded Endpoint called');

      // add a new job to the job queue
      jobsService.newJob({
        bucket: bucket,
        key: key
      });

      videoController.updateVideoURL(key);

      // Getting id from object key
      var id = key.substring(0, key.indexOf('/') + 1)
      var s3url = 'https://' + bucket + '.s3.amazonaws.com/' + key;
      var requestData = {
        audio_src_url: s3url,
        language_model: 'computer-science-model-3',
        webhook_url: 'http://13.235.87.37:3000/v1/videos/notify-transcription/' + id
      };

      // Calling assemblyai for transcribing the video
      axios.post('https://api.assemblyai.com/v2/transcript', requestData,
        { headers: { 'Authorization': 'c91036f1ae3547759bb56297e28d9730', 'Content-Type': 'application/json' } })
        .then((result) => {
          console.log('Response recieved : ' + result);
            //Updating topicsStatus as processing
            metaDataService.updateStatus(id, {"topicsStatus": "processing"}).then(function (data) {
                console.log(data.message)
            }).catch(function (err) {
                console.log(err.message);
            });
        }).catch((err) => {
          console.log('Error: ' + err)
        })
    }

  }
});

router.post('/notify-transcription/:id', function (req, res) {
  // Calling python API for topic segmentation
  axios.post('http://13.235.87.37/vtutor-transcriptions-api/v1/get-transcript', req.body).then((data) => {
    console.log('id:  ' + req.params.id);
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.params.id + '/transcript/transcript.txt',
      Body: data.data.result.transcript,
      ACL: 'public-read'
    };
    // Uploading transcript to S3
    s3bucket.upload(params, function (s3Err, data) {
      if (s3Err) throw s3Err
      console.log("Transcript uploaded successfully")
    });
    res.status(data.status).send(data.data.result);

    // Saving the transcript in DB
    metaDataService.saveTranscript(req.params.id, data.data.result.words).then(function (data) {
      console.log(data.message)
    }).catch(function (err) {
      console.log(err.message);
    });

    // Saving Topics
    metaDataService.updateTopics(req.params.id, { "topics": data.data.result.timestamps }).then(function (data) {
      console.log(data.message)
    }).catch(function (err) {
      console.log(err.message);
    });
  }).catch((err) => {
    console.log('Error: ' + err)
    res.status(err.status).send(err.result);
  });
  //Updating topicsStatus as done
    metaDataService.updateStatus(req.params.id, {"topicsStatus": "done"}).then(function (data) {
        console.log(data.message)
    }).catch(function (err) {
        console.log(err.message);
    });
});

router.put('/update-comments/:id', function (req, res) {
  metaDataService.updateComments(req.params.id, req.body).then(function (data) {
    res.status(data.status).send(data);
  }).catch(function (err) {
    res.status(err.status).send(err.message);
  });
})

router.put('/update-topics/:id', function (req, res) {
  metaDataService.updateTopics(req.params.id, req.body).then(function (data) {
    res.status(data.status).send(data);
  }).catch(function (err) {
    res.status(err.status).send(err);
  });
})

router.put('/update-status/:id', function (req, res) {
  metaDataService.updateStatus(req.params.id, req.body).then(function (data) {
    res.status(data.status).send(data);
  }).catch(function (err) {
    res.status(err.status).send(err.message);
  });
})

router.get('/get-by-status/:status', function (req, res) {
  metaDataService.getVideoByStatus(req.params.status).then(function (data) {
    res.status(data.status).send(data.data);
  }).catch(function (err) {
    res.status(err.status).send(err.message);
  });
})



module.exports = router
