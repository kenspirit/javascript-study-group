var fs = require('fs')
var path = require('path')
var Promise = require('bluebird')
var config = require('../../system/config-manager').getConfig()

var writeFile = Promise.promisify(fs.writeFile)

module.exports.uploadFile = uploadFile

function uploadFile(fileName, file) {
  var filePath = config.base.upload.path + fileName
  var writeStream = fs.createWriteStream(path.resolve(process.cwd(), filePath))
  file.pipe(writeStream)

  return new Promise(function(resolve, reject) {
    writeStream.on('close', function() {
      resolve(filePath.replace('.', ''))
    })
    writeStream.on('error', reject)
    return true
  })
}
