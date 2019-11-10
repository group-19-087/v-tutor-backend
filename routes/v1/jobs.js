const express = require('express');
const router = express.Router();
const jobsService = require('../../services/jobs.service');

router.post('/test', (request, response) => {
    try {
        jobsService.newJob(request.body);
        response.status(200).send('Job request complete');
    } catch (error) {
        response.status(500).send(error);
    }

})

module.exports = router;