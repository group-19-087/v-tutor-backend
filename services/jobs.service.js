var Queue = require('bull');

var ocrService = require('./ocr.service')
var frameController = require('../frames/frameController')
var extractFrames = frameController.extract
var emptyFrameFolder = frameController.emptyFrameFolder
var uploadThumbnail = frameController.uploadThumbnail

var jobQueue = new Queue('job-queue');

jobQueue.process(function (job, done) {

    // Then handle frame extraction
    extractFrames(job.data.bucket, job.data.key).then((data) => {
        console.log('extract frames promise data : ' + data)
        uploadThumbnail(job.data.bucket, job.data.key)
        ocrService.runOCR().then((data) => {
          console.log("ocr promise data : " + data)
          emptyFrameFolder();
        }).catch((err) => {
          console.log(err)
          emptyFrameFolder();
        })
      }).catch((err) => {
        console.log(err)
        emptyFrameFolder();
      })

    console.log('job completed')
    // call done when finished
    done();
});


module.exports.newJob = function (data) {
    jobQueue.add(data);
}
