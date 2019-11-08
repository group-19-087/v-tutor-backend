var Queue = require('bull');

var jobQueue = new Queue('job-queue');
jobQueue.process(function (job, done) {

    console.log('job completed')
    // call done when finished
    done();
});


module.exports.newJob = function (data) {
    jobQueue.add({
        msg: 'job added to queue started',
        data: data
    });
}
