const spawn = require('child_process').spawn

module.exports.extractWikiArticle = function (keyword) {
    return new Promise((resolve, reject) => {
        pathToScript = __dirname + "/python/wikipedia-extractor/extractor.py"
        const extractorScript = spawn('python', [pathToScript, 'abstract classes'])    
        
        let output = '';

        extractorScript.on('error', function () {
            console.log('Failed to start child.');
            reject('Failed to start child.');
        });
        extractorScript.on('close', function (code) {
            console.log('Child process exited with code ' + code);
            if (code !== 0) {
                reject('Child process exited with code ' + code);
            } 
        });
        extractorScript.stdout.on('data', (data) => {
            // console.log(String.fromCharCode.apply(null, data));
            // resolve(String.fromCharCode.apply(null, data));
            // console.log(data); 
            output += data.toString()
        });

        extractorScript.stdout.on('end', () =>{
            resolve(output)
        })
    });
}

module.exports.generateQuestions = function(lectureId, keyword) {
    console.log(keyword);
    this.extractWikiArticle(keyword).then(result => {
        console.log('result >>> ', result);
    }).catch(err => {
        console.log('err >>>', err);
    })
}
