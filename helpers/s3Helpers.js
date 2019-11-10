var AWS = require('aws-sdk');
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
                resolve(data.KeyCount)
            }
        });
    })
}
