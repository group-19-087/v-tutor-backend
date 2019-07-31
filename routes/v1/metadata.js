const express = require('express');
const router = express.Router();
const metadataService = require('../../services/metadata.service');

router.get('/:id', async (request, response) => {
    try {
        const projectionValues = request.header('cdap-projection-values');
        const data = await metadataService.findMetaDataById(request.params.id, projectionValues);
        response.send(data);
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

module.exports = router;