const AWS = require('aws-sdk');
const fs = require('fs');
const spawn = require('child_process').spawn;

const s3 = new AWS.S3();

module.exports.extract = function (bucket, key) {
    const params = { Bucket: bucket , Key: key };
    const url = s3.getSignedUrl('getObject', params);
    const tmpDirectory = '~/tmp/frames';
    console.log('The URL is', url);

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(tmpDirectory)){
            fs.mkdirSync(tmpDirectory);
            fs.chmod( tmpDirectory, '755', function(err){
                if(err){
                    console.log(err);
                    throw err;
                }
                console.log('Created directory');
            });
            resolve('created directory');
        } else {
            console.log('directory exists');
            resolve('directory exists');
        }

          // const ffmpeg = spawn('ffmpeg', [
    //     '-i', 
    //     `${ url }`, 
    //     '-c:a', 
    //     'aac', 
    //     `media/${ fileName }`
    // ]);

    // ffmpeg.on('exit', (statusCode) => {
    // if (statusCode === 0) {
    //     console.log('conversion successful')
    // }
    // })

    // ffmpeg.stderr.on('data', (err) => {
    //     console.log('err:', new String(err))
    // })
    })
}

function extractFrames(){
    console.log(target);
    var dir = '/tmp/frames';
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
            fs.chmod('/tmp/frames', '755', function(err){
                if(err){
                    console.log(err);
                }
                console.log("Created directory");
            });
        }
        const ffmpeg = spawn('ffmpeg', [
            '-i',
            target,
            '-vf',
            'fps=1',
            '/tmp/frames/frame-%04d.jpg',
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
    });
}