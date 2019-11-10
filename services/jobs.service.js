var Queue = require('bull');

var ocrService = require('./ocr.service')
var codeMatchService = require('./codematch.service')
var slideMatchingService = require('./slide-matching.service')
var frameController = require('../frames/frameController')
var s3Helpers = require('../helpers/s3Helpers')
var extractFrames = frameController.extract
var emptyFrameFolder = frameController.emptyFrameFolder
var uploadThumbnail = frameController.uploadThumbnail

var jobQueue = new Queue('job-queue');
var promiseArray = [];

jobQueue.process(function (job, done) {

  // handle frame extraction
  extractFrames(job.data.bucket, job.data.key).then((data) => {

    const s3CodeFilePath = job.data.key + '/code_files';
    const s3SlideFilePath = job.data.key + '/lecture_slides';

    console.log('FRAME EXTRACTOR : ' + data)
    uploadThumbnail(job.data.bucket, job.data.key)

    // run OCR on extracted frames
    ocrService.runOCR().then((data) => {
      console.log("  OCR SERVICE : " + data)

      // check if code folder exists on s3
      s3Helpers.checkIfExists(s3CodeFilePath).then(code_exists => {

        promiseArray.push(codeMatchService.runCodeMatching(code_exists));

        // check if slides exist on s3
        s3Helpers.checkIfExists(s3SlideFilePath).then(slides_exist => {

          promiseArray.push(slideMatchingService.slideMatching(slides_exist));
          Promise.all(promiseArray).then((promiseResults) => {
            console.log("SLIDE MATCHER : " + promiseResults[0]);
            console.log(" CODE MATCHER : " + promiseResults[1]);
            emptyFrameFolder();
            console.log('  JOB SERVICE : job completed')
            done();
          }).catch((err) => {
            console.log(err);
            emptyFrameFolder();
            console.log('  JOB SERVICE : job completed')
            done();
          })

        })
      }).catch((err) => {
        console.log(err);
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
      console.log('  JOB SERVICE : job completed')
      done();
    })

  }).catch((err) => {
    console.log(err)
    emptyFrameFolder();
    console.log('  JOB SERVICE : job completed')
    done();
  })
});


module.exports.newJob = function (data) {
  jobQueue.add(data);
}
