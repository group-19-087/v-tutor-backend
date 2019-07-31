const metaDataService = require('../services/metadata.service');
const config = require('../config.json')

const { s3URL } = config;

module.exports.updateVideoURL = function (videoKey) {
    const videoId = videoKey.split('/')[0];
    const thumbnailURL = s3URL + `${videoId}/thumbnail/thumbnail.jpg`;
    const videoURL = s3URL + videoKey;
    metaDataService.updateMetadataById(videoId, {
      video_url: videoURL,
      thumbnailUrl: thumbnailURL
    });
  }