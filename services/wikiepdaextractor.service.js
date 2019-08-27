const spawn = require('child_process').spawn

module.exports.extractWikiArticle = function (keyword) {
    return new Promise((resolve, reject) => {

        extractorScript.on('error', function () {
            console.log('Failed to start child.');
            reject('Failed to start child.');
        });
        extractorScript.on('close', function (code) {
            console.log('Child process exited with code ' + code);
            if (code !== 0) {
                reject('Child process exited with code ' + code);
            } else {
                extractorScript.stdout.on('data', (data) => {
                    console.log(String.fromCharCode.apply(null, data));
                    resolve(String.fromCharCode.apply(null, data));
                    // console.log(data); 
                });
            }
        });
    });
}
