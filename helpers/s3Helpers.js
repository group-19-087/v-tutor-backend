var AWS = require('aws-sdk');
var fs = require('fs')

require('dotenv').config()

const s3 = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
    region: process.env.AWS_REGION
})

module.exports.checkIfExists = function (path) {

    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.BUCKET_NAME, /* required */
            Prefix: path,
        };

        s3.listObjectsV2(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            } else {
                resolve({
                    exists: data.KeyCount > 0,
                    contents: data.Contents
                });
            }
        });
    })
}

module.exports.downloadFile = function (saveFilePath, key) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key
        };
        s3.getObject(params, (err, data) => {
            if (err) {
                reject(err)
            };
            fs.writeFileSync(saveFilePath, data.Body.toString());
            resolve(`${saveFilePath} has been created!`);
        });
    })
};
