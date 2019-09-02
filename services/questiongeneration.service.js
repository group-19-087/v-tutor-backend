const spawn = require('child_process').spawn
const axios = require('axios')

module.exports.extractWikiArticle = function (keyword) {
    return new Promise((resolve, reject) => {
        pathToScript = __dirname + "/python/wikipedia-extractor/extractor.py"
        const extractorScript = spawn('python3', [pathToScript, keyword])    
        
        let output = '';

        extractorScript.on('error', function () {
            console.log('Failed to start child.');
            reject('Failed to start child.');
        });
        extractorScript.on('close', function (code) {
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
    this.extractWikiArticle(keyword).then(result => {
        const text = result;
        data = {
            lectureId: lectureId,
            document: text
        }
        console.log('result >>> ', data);
        axios.post('http://cdapquestiongenerationapi-env.p5wki2jfri.ap-south-1.elasticbeanstalk.com/generate', data).then((response) => {
            console.log(response.data);
        }).catch((err) => {
            console.log(err); 
        })
    }).catch(err => {
        console.log('err >>>', err);
    })
}
