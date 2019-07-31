const express = require('express');
const router = express.Router();
const metadataService = require('../../services/metadata.service');

router.get('/:id', async (request, response) => {
    try {
        const projection = "videoTitle description";
        const data = await metadataService.findMetaDataById(request.params.id, projection);
        response.send(data);
    } catch (error) {
        response.status(500).send(error);
    }
})

module.exports = router;