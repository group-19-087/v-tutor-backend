const AWS = require('aws-sdk');
const fs = require('fs');
const spawn = require('child_process').spawn;

const s3 = new AWS.S3();

module.exports.extract = function (bucket, key) {
    const params = { Bucket: bucket, Key: key };
    const url = s3.getSignedUrl('getObject', params);
    const tmpDirectory = __dirname + '/tmp/frames';
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
            }
        });

        ffmpeg.stderr.on('data', (err) => {
            console.log(err);
            //reject(err);
        });
    })
}
