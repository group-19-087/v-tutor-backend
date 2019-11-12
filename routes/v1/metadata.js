const express = require('express');
const router = express.Router();
const metadataService = require('../../services/metadata.service');

const util = require('util')

router.get('/search', async (request, response) => {
    try {
        const projectionValues = request.header('cdap-projection-values');
        const searchString = request.header('cdap-search-string');
        const data = await metadataService.search(searchString, projectionValues);
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get('/:id', async (request, response) => {
    try {
        const projectionValues = request.header('cdap-projection-values');
        const data = await metadataService.findMetaDataById(request.params.id, projectionValues);
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.put('/:id', (request, response) => {
    try {
        metadataService.updateMetadataById(request.params.id, request.body);
        response.status(200).send(request.body);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get('/', async (request, response) => {
    try {
        const projectionValues = request.header('cdap-projection-values');
        const data = await metadataService.getAll(projectionValues);
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.post('/:id/questions', (request, response) => {
    try {
        metadataService.updateMetadataById(request.params.id, {questions: request.body});
        response.status(200).send(request.body);
    } catch (error) {
        response.status(500).send(error);
    }

})

router.put('/:id/questions', (request, response) => {
    try {
        metadataService.updateMetadataById(request.params.id, {questions: request.body, questionsStatus: 'done'});
        response.status(200).send('Questions updated successfully');
    } catch (error) {
        response.status(500).send(error);
    }
})

router.put('/slides/:id', (request, response) => {
    try {
        metadataService.updateSlides(request.params.id, request.body);
        response.status(200).send(request.body);
    }catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;