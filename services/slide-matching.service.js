const fs = require('fs')
const spawn = require('child_process').spawn

module.exports.slideMatching = function (response) {
    console.log("SLIDE MATCHER: Starting...");
    return new Promise((resolve, reject) => {

        if (response.exists) {
            const pathToScript = __dirname + "/python/slide-matching/slide-matching.py"
            const id = response.contents[0].Key.slice(response.content[0].Key.lastIndexOf('/') + 1);
            const lectureSlides = downloadFile('/home/', 'cdap-19-087-vtutor-lecturematerials', id + 'slides.pdf')
            //const pathToS3 = "https://cdap-19-087-vtutor-lecturematerials.s3.ap-south-1.amazonaws.com/" + id + "Slides.pdf";
            const smScript = spawn('python', [pathToScript], lectureSlides, id);
            smScript.on('exit', (statusCode) => {
                if (statusCode === 0) {
                    console.log('Slide Matching Script exited successfully with code 0');
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

const downloadFile = (filePath, bucketName, key) => {

    const params = {
        Bucket: bucketName,
        Key: key
    };

    s3.getObject(params, (err, data) => {
        if (err) console.error(err);
        fs.writeFileSync(filePath, data.Body.toString());
        console.log(`${filePath} has been created!`);
    });
};
