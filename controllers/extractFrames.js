const AWS = require('aws-sdk');
const fs = require('fs');
const spawn = require('child-process').spawn;

const s3 = new AWS.S3();

module.exports.extract = function (bucket, key) {
    const params = { Bucket: bucket , Key: key };
    const url = s3.getSignedUrl('getObject', params);
    console.log('The URL is', url);
}

// let tempFilePath = './audio/someFile.mp3';
// let fileName = 'someConvertedFile.aac';

// let ffmpeg = spawn('ffmpeg', ['-i', `${ tempFilePath }`, '-c:a', 'aac', `media/${ fileName }`]);
// ffmpeg.on('exit', (statusCode) => {
//   if (statusCode === 0) {
//      console.log('conversion successful')
//   }
// })

// ffmpeg
//   .stderr
//   .on('data', (err) => {
//     console.log('err:', new String(err))
//   })