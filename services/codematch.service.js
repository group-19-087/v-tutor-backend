const fs = require('fs')
const spawn = require('child_process').spawn
const s3Helpers = require('../helpers/s3Helpers')

module.exports.runCodeMatching = function (response) {
  
  console.log(" CODE MATCHER : Running...");
  return new Promise((resolve, reject) => {

    if (response.exists) {

      const saveFilePath = __dirname + '/python/codematching/code';
      const title = response.contents[0].Key.slice(response.contents[0].Key.lastIndexOf('/') + 1);
      const pathToScript = __dirname + "/python/codematching/main.py"
      let output = '';

      fs.stat(saveFilePath, function (err, stats) {
        if (err) {
          console.log(" CODE MATCHER : code file doesnt  exist on disk");
          // download file
          s3Helpers.downloadFile(saveFilePath, response.contents[0].Key).then(msg => {
            // Run codematching after file download
            const matchScript = spawn('python', [
              pathToScript,
              '--title',
              title
            ])

            matchScript.on('exit', (statusCode) => {
              if (statusCode === 0) {
                console.log('CODE MATCHER : Code Matching Script executed successfully \n')
                resolve(output)
              } else {
                console.log('CODE MATCHER : Non zero exit code : ' + statusCode)
                reject('CODE MATCHER : Non zero status code')
              }
            })

            matchScript.stdout.on('data', (data) => {
              output += data.toString()
            })

            matchScript.stderr.on('data', (err) => {
              console.log('Error : ' + err)
            })

          }).catch(err => {
            console.log(err)
          })
        } else {
          fs.unlink(saveFilePath, function (err) {
            if (err) {
              console.log(err);
            } else {
              //download file after deleting
              console.log('CODE MATCHER : temporary codefile deleted successfully');
              s3Helpers.downloadFile(saveFilePath, response.contents[0].Key).then(msg => {
                // after file download
                const matchScript = spawn('python', [
                  pathToScript,
                  '--title',
                  title
                ])

                matchScript.on('exit', (statusCode) => {
                  if (statusCode === 0) {
                    console.log('CODE MATCHER : Code Matching Script executed successfully \n')
                    resolve(output)
                  } else {
                    console.log('CODE MATCHER : Non zero exit code : ' + statusCode)
                    reject('CODE MATCHER : Non zero status code')
                  }
                })

                matchScript.stdout.on('data', (data) => {
                  output += data.toString()
                })

                matchScript.stderr.on('data', (err) => {
                  console.log('Error : ' + err)
                })
              }).catch(err => {

              })
            }
          });
        }
      });
    } else {
      resolve(false)
    }
  })
}
