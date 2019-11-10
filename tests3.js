var s3Helpers = require('./helpers/s3Helpers')

s3Helpers.checkIfExists('d95439e1-66b9-4f2f-b1dc-72f15d564c9d/code').then(exists => {
    console.log(exists);
}).catch(err => {
    console.log(err);
})


