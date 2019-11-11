var s3Helpers = require('./helpers/s3Helpers')
var fs = require('fs')

s3Helpers.checkIfExists('733edec2-8967-4568-a60b-60743d8a5213/code_files').then(result => {

    if (result.exists) {
        const title = result.contents[0].Key.slice(result.contents[0].Key.lastIndexOf('/') + 1);
        console.log('Title ' + title)

        const saveFilePath = __dirname + '/services/python/codematching/code';

        fs.stat(saveFilePath, function (err, stats) {
            if (err) {
                console.log("code file doesnt  exist on disk");
                // download file
                s3Helpers.downloadFile(saveFilePath, result.contents[0].Key)
            } else {
                fs.unlink(saveFilePath, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        //after deleting file download
                        console.log('temporary codefile deleted successfully');
                        s3Helpers.downloadFile(saveFilePath, result.contents[0].Key)
                    }
                });
            }
        });
    }
}).catch(err => {
    console.log(err);
})


