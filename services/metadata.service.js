var MetaData = require('../models/metadata.schema')


module.exports.saveMetaData = function(data) {
  var metaData = new MetaData(data);
  metaData.save(function (err, obj) {
    if (err) return console.error(err);
  });
}

module.exports.updateComments = function (id, comment) {
    return new Promise(function (resolve, reject) {
        MetaData.findOneAndUpdate({_id: id}, { $push: { comments: comment}}).then(function () {
            resolve({status: 201, message: "Record updated"});
        }).catch(function (reason) {
            reject({status: 500, message: "Error "+reason});
        });
    })
}


