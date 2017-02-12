var ImageManager = require('./image-manager')
var buildApiResponse = require('../../system/util').buildApiResponse
var parseRequestParams = require('../../system/util').parseRequestParams
var parseResultForTable = require('../../system/util').parseResultForTable
var logger = require('../../system/log-manager')

module.exports = {
  listImagePage: listImagePage,
  loadImagePage: loadImagePage,
  listImage: listImage,
  loadImage: loadImage,
  createImage: createImage,
  updateImage: updateImage,
  removeImage: removeImage,
  updateImageStatus: updateImageStatus
}

function listImagePage(req, res, next) {
  res.render('image/imageList')
}

function loadImagePage(req, res, next) {
  res.render('image/imageProfile', {
    id: req.params.id
  })
}

function listImage(req, res, next) {
  req.query.sort = 'updatedAt'
  var params = parseRequestParams(req)
  ImageManager.list(params)
    .then(function(entities) {
      return res.json(parseResultForTable(entities))
    })
    .catch(next)
}

function loadImage(req, res, next) {
  ImageManager.load(req.params.id)
    .then(function(entity) {
      return res.json(buildApiResponse(entity))
    })
    .catch(next)
}

function createImage(req, res, next) {
  var requestEntity = req.body

  ImageManager.create(requestEntity)
    .then(function(createdEntity) {
      return res.json(buildApiResponse(createdEntity))
    })
    .catch(next)
}

function updateImage(req, res, next) {
  var requestEntity = req.body
  requestEntity._id = req.params.id

  ImageManager.update(requestEntity)
    .then(function(updatedEntity) {
      return res.json(buildApiResponse(updatedEntity))
    })
    .catch(next)
}

function updateImageStatus(req, res, next) {
  var imageId = req.params.id
  var status = req.body.status

  ImageManager.updateStatus(imageId, status)
    .then(function(updatedEntity) {
      return res.json(buildApiResponse(updatedEntity))
    })
    .catch(next)
}

function removeImage(req, res, next) {
  ImageManager.remove(req.params.id)
    .then(function() {
      return res.json(buildApiResponse(true))
    })
    .catch(next)
}
