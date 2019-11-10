const spawn = require('child_process').spawn
const rimraf = require('rimraf')

module.exports.runOCR = function() {
  return new Promise((resolve, reject) => {

    pathToScript = __dirname + "/python/ocr/main.py"
    const ocrScript = spawn('python', [pathToScript])

    ocrScript.on('exit', (statusCode) => {
      if (statusCode === 0) {
        console.log('OCR Script exited successfully with code 0')
        resolve('OCR done')
      } else {
        console.log('Non zero exit code : ' + statusCode)
        reject('Non zero status code')
      }
    })

    ocrScript.stdout.on('data', (data) => {
      console.log('OCR STDOUT : ' + data.toString())
      // reject(err);
    })

    ocrScript.stderr.on('data', (err) => {
      console.log('Error : ' + err)
      // reject(err);
    })
  })
}

module.exports.emptyOcrFolder = function () {
  rimraf(`${tmpDirectory}/*`, function () { console.log('frame folder emptied'); });
}
