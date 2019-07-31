var MetaData = require('../models/metadata.schema')

module.exports.saveMetaData = function (data) {
  var metaData = new MetaData(data);
  metaData.save(function (err, obj) {
    if (err) return console.error(err);
  });
}

module.exports.updateMetadataById = function (metaDataId, data) {
  MetaData.updateOne({ id: metaDataId }, data, function (err, res) {
    if (err) {
      console.log(err)
    } else {
      console.log('MetaData updated')
    }
  });
}

// Projection is values separated by spaces (Eg: "video_url thumbnailUrl")
module.exports.findMetaDataById = async function (metaDataId, projection) {
  return MetaData.findOne({ id: metaDataId }, projection).exec();
}
