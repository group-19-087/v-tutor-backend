var Queue = require('bull');

var ocrService = require('./ocr.service')
var codeMatchService = require('./codematch.service')
var metaDataService = require('./metadata.service')
var slideMatchingService = require('./slide-matching.service')
var frameController = require('../frames/frameController')
var s3Helpers = require('../helpers/s3Helpers')
var extractFrames = frameController.extract
var emptyFrameFolder = frameController.emptyFrameFolder
var emptyOcrFolder = ocrService.emptyOcrFolder
var uploadThumbnail = frameController.uploadThumbnail

var jobQueue = new Queue('job-queue');
var promiseArray = [];

var cleanup = function () {
  emptyFrameFolder();
  emptyOcrFolder();
  console.log('  JOB SERVICE : job completed')
  promiseArray.length = 0;
}

jobQueue.process(function (job, done) {

  // handle frame extraction
  extractFrames(job.data.bucket, job.data.key).then((data) => {

    const videoId = job.data.key.split('/')[0];
    let codeResult = null;
    let slideResult = null;
    const s3CodeFilePath = videoId + '/code_files';
    const s3SlideFilePath = videoId + '/lecture_slides';

    console.log('FRAME EXTRACTOR : ' + data)
    uploadThumbnail(job.data.bucket, job.data.key)
    console.log('JOB HANDLER : Starting Process flow for ' + videoId + '...')
    // run OCR on extracted frames
    // ocrService.runOCR().then(
    //   (data) => {
    //     console.log("  OCR SERVICE : " + data)
    s3Helpers.checkIfExists(s3CodeFilePath).then(
      (response) => {
        if (response.exists) {
          ocrService.runOCR().then(
            (data) => {
              console.log("  OCR SERVICE : " + data)
              promiseArray.push(codeMatchService.runCodeMatching(response));
              // check if slides folder exists on s3
              s3Helpers.checkIfExists(s3SlideFilePath).then(
                (response) => {
                  promiseArray.push(slideMatchingService.slideMatching(response));
                  Promise.all(promiseArray).then(
                    (promiseResults) => {
                      // promiseResults[0] --> data from first promise in array
                      codeResult = JSON.parse(promiseResults[0]);
                      slideResult = JSON.parse(promiseResults[1]);
                      // promiseResults[1] --> data from second promise in array

                      // TODO: Update slide data
                      metaDataService.updateMetadataById(videoId, {
                        code: codeResult ? [codeResult] : [],
                        slidesStatus: 'done',
                        codeStatus: 'done',
                      })
                      // Processing of slide promise data
                      cleanup();
                      done();
                    }
                  ).catch((err) => {
                    console.log(err);
                    cleanup();
                    done();
                  })
                }
              )
            }).catch((err) => {
              console.log(err)
              cleanup();
              done();
            })
        } else {
          promiseArray.push(codeMatchService.runCodeMatching(response));
          // check if slides folder exists on s3
          s3Helpers.checkIfExists(s3SlideFilePath).then(
            (response) => {
              promiseArray.push(slideMatchingService.slideMatching(response));
              Promise.all(promiseArray).then(
                (promiseResults) => {
                  // promiseResults[0] --> data from first promise in array
                  codeResult = JSON.parse(promiseResults[0]);
                  slideResult = JSON.parse(promiseResults[1]);
                  // promiseResults[1] --> data from second promise in array

                  // TODO: Update slide data
                  metaDataService.updateMetadataById(videoId, {
                    code: codeResult ? [codeResult] : [],
                    slidesStatus: 'done',
                    codeStatus: 'done',
                  })
                  // Processing of slide promise data
                  cleanup();
                  done();
                }
              ).catch((err) => {
                console.log(err);
                cleanup();
                done();
              })
            }
          )
        }
      }
    ).catch((err) => {
      console.log(err);
    })
    // OCR END
    //   }
    // ).catch((err) => {
    //   console.log(err)
    //   cleanup();
    //   done();
    // })

  }).catch((err) => {
    console.log(err)
    cleanup();
    done();
  })
});


module.exports.newJob = function (data) {
  jobQueue.add(data);
}
