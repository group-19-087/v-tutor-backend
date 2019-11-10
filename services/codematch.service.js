const fs = require('fs')
const spawn = require('child_process').spawn

module.exports.runCodeMatching = function (enabled) {
  return new Promise((resolve, reject) => {

    if (enabled) {
      pathToScript = __dirname + "/python/codematching/main.py"
      const matchScript = spawn('python', [pathToScript])

      let output = '';

      matchScript.on('exit', (statusCode) => {
        if (statusCode === 0) {
          console.log('Code Matching Script executed successfully \n')
          resolve(output)
        } else {
          console.log('Non zero exit code : ' + statusCode)
          reject('Non zero status code')
        }
      })

      matchScript.stdout.on('data', (data) => {
        output += data.toString()
      })

      matchScript.stderr.on('data', (err) => {
        console.log('Error : ' + err)
      })
    } else {
      resolve('Code Matching not enabled')
    }
  })
}
