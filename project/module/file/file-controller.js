var path = require('path')
var Busboy = require('busboy')
var uuid = require('node-uuid')
var uploadFile = require('./file-manager').uploadFile
var buildApiResponse = require('../../system/util').buildApiResponse
var logger = require('../../system/log-manager')

module.exports.uploadRequestFileMiddleware = uploadRequestFileMiddleware

function uploadRequestFileMiddleware(req, res, next) {
  var busboy = new Busboy({headers: req.headers})

  busboy.on('file', function(fieldName, file, fileName, encoding, mimeType) {
    var newFileName = uuid.v4() + path.extname(fileName)

    uploadFile(newFileName, file)
      .then(function(path) {
        res.json(buildApiResponse(path))
      })
      .catch(function(err) {
        logger.error({
          reqNoBody: req, err: err,
          data: {newFileName: newFileName}
        }, 'file-controller.uploadRequestFileMiddleware')

        res.status(500).json(buildApiResponse(null, 'Failed to upload.'))
      })
  })

  req.pipe(busboy)
}
