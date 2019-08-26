var MetaData = require('../models/metadata.schema')
var ObjectId = require('mongoose').Types.ObjectId; 


module.exports.saveMetaData = function (data) {
  var metaData = new MetaData(data);
  metaData.save(function (err, obj) {
    if (err) return console.error(err);
  });
}

module.exports.updateComments = function (id, comment) {
    return new Promise(function (resolve, reject) {
        MetaData.findOneAndUpdate({_id: id}, { $push: { comments: comment}}).then(function () {
            resolve({status: 200, message: "Record updated"});
        }).catch(function (reason) {
            reject({status: 500, message: "Error "+reason});
        });
    })
}

module.exports.updateTopics = function (id, topic) {
    return new Promise(function (resolve, reject) {
        MetaData.findOneAndUpdate({_id: id}, topic).then(function () {
            resolve({status: 200, message: "Record updated"});
        }).catch(function (reason) {
            reject({status: 500, message: "Error "+reason});
        });
    })
}

module.exports.updateStatus = function (id, data) {
    return new Promise(function (resolve, reject) {
        MetaData.findOneAndUpdate({_id: id}, data).then(function () {
            resolve({status: 200, message: "Record updated"});
        }).catch(function (reason) {
            reject({status: 500, message: "Error "+reason});
        });
    })
}

module.exports.getVideoByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        MetaData.find({status: status}).exec().then(function (data) {
            resolve({status: 200, data: data});
        }).catch(function (reason) {
            reject({status: 500, message: "Error "+reason});
        });
    })
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

module.exports.findMetaDataByModule = async function (moduleId, projection) {
  return new Promise((resolve, reject) => {
    MetaData.find({ module: new ObjectId(moduleId) }, projection, ((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    }))
  })
}

module.exports.getAll = async function (projection) {
  return MetaData.find({status: 'published'}, projection).exec();
}

module.exports.search = async function (searchTerm, projection) {
  console.log("Search term " + searchTerm);
  return MetaData.find({$text: {$search: searchTerm}}, projection).exec();
}