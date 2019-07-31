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

