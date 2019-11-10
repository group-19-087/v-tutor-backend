var Queue = require('bull');

var ocrService = require('./ocr.service')
var codeMatchService = require('./codematch.service')
var slideMatchingService = require('./slide-matching.service')
var frameController = require('../frames/frameController')
var extractFrames = frameController.extract
var emptyFrameFolder = frameController.emptyFrameFolder
var uploadThumbnail = frameController.uploadThumbnail

var jobQueue = new Queue('job-queue');
var promiseArray = [];

jobQueue.process(function (job, done) {

  // handle frame extraction
  extractFrames(job.data.bucket, job.data.key).then((data) => {

    console.log('extract frames promise data : ' + data)
    uploadThumbnail(job.data.bucket, job.data.key)

    // run OCR on extracted frames
    ocrService.runOCR().then((data) => {
      console.log("ocr promise data : " + data)

      promiseArray.push(slideMatchingService.slideMatching(false));
      promiseArray.push(codeMatchService.runCodeMatching(false));

      Promise.all(promiseArray).then((promiseResults) => {
        console.log("slide matching data : " + promiseResults[0]);
        console.log("codematch promise data : " + promiseResults[1]);
        emptyFrameFolder();
        console.log('job completed')
        done();
      }).catch((err) => {
        console.log(err);
        emptyFrameFolder();
        console.log('job completed')
        done();
      })

      // slideMatchingService.slideMatching().then((data) => {
      //   console.log("data : " + data)
      //   emptyFrameFolder()
      // }).catch((err) => {
      //   console.log(err);
      //   emptyFrameFolder();
      // })
      // // Run code matching
      // codeMatchService.runCodeMatching().then((data) => {
      //   console.log("codematch promise data : " + data)
      //   emptyFrameFolder();
      // }).catch((err) => {
      //   console.log(err)
      //   emptyFrameFolder();
      // })

    }).catch((err) => {
      console.log(err)
      emptyFrameFolder();
      console.log('job completed')
      done();
    })

  }).catch((err) => {
    console.log(err)
    emptyFrameFolder();
    console.log('job completed')
    done();
  })
});


module.exports.newJob = function (data) {
  jobQueue.add(data);
}
