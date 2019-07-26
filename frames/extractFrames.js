const AWS = require('aws-sdk');
const fs = require('fs');
const spawn = require('child_process').spawn;

const s3 = new AWS.S3();

module.exports.extract = function (bucket, key) {
    const params = { Bucket: bucket, Key: key, Expires: 300};
    const url = s3.getSignedUrl('getObject', params);
    const tmpDirectory = __dirname + '/extracted';
    console.log('The URL is', url);
    console.log('tmpDirectory : ' + `${tmpDirectory}/frame-%04d.jpg`);

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(tmpDirectory)) {
            fs.mkdirSync(tmpDirectory, {recursive: true}, (err) => {
                console.log(err);
            });
            fs.chmod(tmpDirectory, '755', function (err) {
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log('Created directory');
            });
        } else {
            console.log('directory exists');
        }

        const ffmpeg = spawn('ffmpeg', [
            '-i',
            url,
            '-vf',
            'fps=0.5',
            `${tmpDirectory}/frame-%04d.jpg`,
            '-hide_banner'
        ]);

        ffmpeg.on('exit', (statusCode) => {
            if (statusCode === 0) {
                console.log('Frames extracted');
                resolve('Frames extracted');
            } else {
                console,log('Non zero exit code : ' + statusCode);
                reject('Non zero status code');
            }
        });

        ffmpeg.stderr.on('data', (err) => {
            console.log('Error : ' + err);
            //reject(err);
        });
    })
}

module.exports.uploadThumbnail = function (bucket, key) {
    const thumbnailFilePath = __dirname + '/extracted/frame-0001.jpg';
    const s3Key = `${key.split("/")[0]}/thumbnail.jpg` 

    console.log("THUMBNAIL FILEPATH : " + filepath);
    console.log("S3 KEY : " + s3Key);
}

