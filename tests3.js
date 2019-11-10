var s3Helpers = require('./helpers/s3Helpers')

s3Helpers.checkIfExists('c1668d73-aabf-400e-9023-d05fcf6e2972/code').then(exists => {
    console.log(exists);
}).catch(err => {
    console.log(err);
})


