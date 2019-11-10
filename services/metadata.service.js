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
};

module.exports.updateSlides = function (id, slide) {
    return new Promise(function(resolve, reject) {
        MetaData.findOneAndUpdate({_id: id}, slide).then(function() {
            resolve({status: 200, message: "Update Successful"});
        }).catch(function (reason) {
            reject({status: 500, message: "Error " + reason});
        })
    })
};

module.exports.updateTopics = function (id, topic) {
    return new Promise(function (resolve, reject) {
        MetaData.findOneAndUpdate({id: id}, topic).then(function () {
            resolve({status: 200, message: "Topics updated"});
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

module.exports.updateCode = function (id, code) {
    return new Promise(function (resolve, reject) {
        MetaData.findOneAndUpdate({id: id}, { $push: { code: code}}).then(function () {
            resolve({status: 200, message: "Code updated"});
        }).catch(function (reason) {
            reject({status: 500, message: "Error "+reason});
        });
    })
};

module.exports.getVideoByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        MetaData.find({status: status}).exec().then(function (data) {
            resolve({status: 200, data: data});
        }).catch(function (reason) {
            reject({status: 500, message: "Error "+reason});
        });
    })
}

module.exports.saveTranscript = function (id, words){
    console.log('Inside method');
    console.log(words);
    return new Promise(function(resolve, reject){
        try{
            let transcript_sentences = [];
            let paragraph = '';
            let count = 0;
            let time = 0;
            for (let i = 0; i < words.length; i++){
                console.log(words[i]);
                paragraph += words[i].text + ' ';
                count += 1;
                if (count === 1){
                    time = words[i].start;
                }
                if(words[i].text.indexOf('.') > -1){
                    transcript_sentences.push({'paragraph': paragraph, 'time': secondsToHMS((time/1000)), 'seconds': Math.floor(time/1000)});
                    paragraph = '';
                    count = 0;
                }
                // if (count >= 3){
                //     transcript_sentences.push({'paragraph': paragraph, 'time': secondsToHMS((time/1000)), 'seconds': Math.floor(time/1000)});
                //     paragraph = '';
                //     count = 0;
                // }
                if (i === (words.length - 1)){
                    transcript_sentences.push({'paragraph': paragraph, 'time': secondsToHMS((time/1000)), 'seconds': Math.floor(time/1000)});
                }
            }
            MetaData.findOneAndUpdate({id: id}, {transcript: transcript_sentences}).then(function () {
                resolve({status: 200, message: "Transcript updated", transcript: transcript_sentences});
            }).catch(function (reason) {
                reject({status: 500, message: "Error "+reason});
            });
        }catch (err){
            reject({status: 500, message: "Error "+err});
        }


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
    MetaData.find({ module: new ObjectId(moduleId), status: "published" }, projection, ((err, res) => {
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
  return MetaData.find({$text: {$search: searchTerm}, status: "published"}, projection).exec();
}

function secondsToHMS(seconds){
    let duration = Number(seconds);
    let h = Math.floor(duration / 3600);
    let m = Math.floor(duration % 3600 / 60);
    let s = Math.floor(duration % 3600 % 60);
    if (h.toString().length < 2 ){
        h = '0' + h;
    }
    if (m.toString().length < 2 ){
        m = '0' + m;
    }
    if (s.toString().length < 2 ){
        s = '0' + s;
    }
    return (h + ':' + m + ':' + s);
}