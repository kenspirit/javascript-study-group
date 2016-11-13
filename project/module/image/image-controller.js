var ImageManager = require('./image-manager')
var buildApiResponse = require('../../system/util').buildApiResponse
var logger = require('../../system/log-manager')

module.exports.listImagePage = listImagePage
module.exports.loadImagePage = loadImagePage
module.exports.listImage = listImage
module.exports.loadImage = loadImage
module.exports.createImage = createImage
module.exports.updateImage = updateImage
module.exports.removeImage = removeImage

function listImagePage(req, res, next) {
  res.render('image/imageList')
}

function loadImagePage(req, res, next) {
  res.render('image/imageProfile', {
    id: req.params.id
  })
}

function listImage(req, res, next) {
  ImageManager.list(req.query)
    .then(function(entities) {
      res.json(buildApiResponse(entities))
    })
    .catch(next)
}

function loadImage(req, res, next) {
  ImageManager.load(req.params.id)
    .then(function(entity) {
      res.json(buildApiResponse(entity))
    })
    .catch(next)
}

function createImage(req, res, next) {
  var requestEntity = req.body

  ImageManager.create(requestEntity)
    .then(function(createdEntity) {
      res.json(buildApiResponse(createdEntity))
    })
    .catch(next)
}

function updateImage(req, res, next) {
  var requestEntity = req.body
  requestEntity._id = req.params.id

  ImageManager.update(requestEntity)
    .then(function(updatedEntity) {
      res.json(buildApiResponse(updatedEntity))
    })
    .catch(next)
}

function removeImage(req, res, next) {
  ImageManager.remove(req.params.id)
    .then(function() {
      res.json(buildApiResponse(true))
    })
    .catch(next)
}
