const fs = require('fs')
const spawn = require('child_process').spawn

module.exports.slideMatching = function (response) {
    console.log("SLIDE MATCHER: Starting...");
    return new Promise((resolve, reject) => {

        if (response.exists) {
            pathToScript = __dirname + "/python/slide-matching/slide-matching.py"
            const smScript = spawn('python', [pathToScript])

            smScript.on('exit', (statusCode) => {
                if (statusCode === 0) {
                    console.log('Slide Matching Script exited successfully with code 0')
                    resolve(true)
                } else {
                    console.log('Non zero exit code : ' + statusCode)
                    reject('Non zero status code')
                }
            })

            smScriptScript.stderr.on('data', (err) => {
                console.log('Error : ' + err)
                // reject(err);
            })
        } else {
            resolve(false)
        }
    })
}
