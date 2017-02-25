var IMAGE_CONSTANTS = require('./image-constants')
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
  setDeleteStatus: setDeleteStatus,
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
  var user = req.user

  if (!user) {
    // 没登录
    params.deleted = false
    params.status = IMAGE_CONSTANTS.STATUS_APPROVED
  } else if (!user.isAdmin) {
    // 登录，普通用户
    var userId = user._id.toString()

    params.$or = [{
        createdUserId: userId
      }, {
        createdUserId: {$ne: userId},
        deleted: false,
        status: IMAGE_CONSTANTS.STATUS_APPROVED
      }]
  }
  // 管理员什么特殊处理也不需要

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

  ImageManager.update(req.user, requestEntity)
    .then(function(updatedEntity) {
      return res.json(buildApiResponse(updatedEntity))
    })
    .catch(next)
}

function updateImageStatus(req, res, next) {
  var imageId = req.params.id
  var status = req.body.status

  ImageManager.updateStatus(req.user, imageId, status)
    .then(function(updatedEntity) {
      return res.json(buildApiResponse(updatedEntity))
    })
    .catch(next)
}

function setDeleteStatus(req, res, next) {
  ImageManager.setDeleteStatus(req.params.id, req.user._id, req.body.status)
    .then(function() {
      return res.json(buildApiResponse(true))
    })
    .catch(next)
}
