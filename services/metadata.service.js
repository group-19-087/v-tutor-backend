var MetaData = require('../models/metadata.schema')

module.exports.saveMetaData = function(data) {
  var metaData = new MetaData(data);
  metaData.save(function (err, obj) {
    if (err) return console.error(err);
  });
}

