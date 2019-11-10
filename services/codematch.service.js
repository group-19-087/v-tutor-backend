const fs = require('fs')
const spawn = require('child_process').spawn

module.exports.runCodeMatching = function() {
  return new Promise((resolve, reject) => {

    pathToScript = __dirname + "/python/codematching/main.py"
    const matchScript = spawn('python', [pathToScript])

    matchScript.on('exit', (statusCode) => {
      if (statusCode === 0) {
        console.log('Code Matching Script exited successfully with code 0')
        resolve('Code Matching done')
      } else {
        console.log('Non zero exit code : ' + statusCode)
        reject('Non zero status code')
      }
    })

    matchScript.stdout.on('data', (data) => {
      console.log('CODE MATCH STDOUT : ' + data.toString())
      // reject(err);
    })

    matchScript.stderr.on('data', (err) => {
      console.log('Error : ' + err)
      // reject(err);
    })
  })
}
