const AWS = require('aws-sdk')
const fs = require('fs')
const spawn = require('child_process').spawn
const rimraf = require('rimraf')

const s3 = new AWS.S3()
const tmpDirectory = __dirname + '/extracted'

module.exports.extract = function (bucket, key) {
  const params = { Bucket: bucket, Key: key, Expires: 300 }
  const url = s3.getSignedUrl('getObject', params)
  console.log('The URL is', url)
  console.log('tmpDirectory : ' + `${tmpDirectory}/frame-%04d.jpg`)

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(tmpDirectory)) {
      fs.mkdirSync(tmpDirectory, { recursive: true }, (err) => {
        console.log(err)
      })
      fs.chmod(tmpDirectory, '755', function (err) {
        if (err) {
          console.log(err)
          throw err
        }
        console.log('Created directory')
      })
    } else {
      console.log('directory exists')
    }

    const ffmpeg = spawn('ffmpeg', [
      '-i',
      url,
      '-vf',
      'fps=0.5',
      `${tmpDirectory}/frame-%04d.jpg`,
      '-hide_banner'
    ])

    ffmpeg.on('exit', (statusCode) => {
      if (statusCode === 0) {
        console.log('Frames extracted')
        resolve('Frames extracted')
      } else {
        console, log('Non zero exit code : ' + statusCode)
        reject('Non zero status code')
      }
    })

    ffmpeg.stderr.on('data', (err) => {
      console.log(err)
      // reject(err);
    })
  })
}

module.exports.emptyFrameFolder = function () {
  rimraf(`${tmpDirectory}/*`, function () { console.log('frame folder emptied'); });
}

module.exports.uploadThumbnail = function (bucket, key) {
  const thumbnailFilePath = __dirname + '/extracted/frame-0001.jpg'
  const s3Key = `${key.split('/')[0]}/thumbnail/thumbnail.jpg`

  fs.readFile(thumbnailFilePath, (err, data) => {
    if (err) throw err
    const params = {
      Bucket: bucket,
      Key: s3Key,
      Body: data
    }
    s3.upload(params, function (s3Error, data) {
      if (s3Error) throw s3Error
      console.log(`File uploaded successfully at ${data.Location}`)
    })
  })
}
