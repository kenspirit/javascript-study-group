var _ = require('lodash')
var ImageModel = require('./image-model')
var executeQuery = require('../../system/db-manager').executeQuery
var getRandomIntInclusive = require('../../system/util').getRandomIntInclusive
var STATUS_APPROVED = require('./image-constants').STATUS_APPROVED

module.exports = {
  list: list,
  load: load,
  create: create,
  update: update,
  setDeleteStatus: setDeleteStatus,
  random: random,
  updateStatus: updateStatus
}

function list(queryRequest) {
  return executeQuery(ImageModel, queryRequest)
}

function load(id) {
  return ImageModel.findOne({_id: id}).exec()
}

function create(entity) {
  return ImageModel.create(entity)
}

function update(user, entity) {
  return load(entity._id)
    .then(function(dbEntity) {
      if (!dbEntity) {
        return false
      }

      if (user._id.toString() !== dbEntity.createdUserId || 
          !user.isAdmin) {
        throw new Error('无权修改')
      }

      delete entity._id

      _.assign(dbEntity, entity)

      return dbEntity.save()
    })
}

function setDeleteStatus(entityId, userId, deleteStatus) {
  return ImageModel.update({_id: entityId, createdUserId: userId},
    {deleted: deleteStatus}).exec()
}

function updateStatus(user, imageId, status) {
  return update(user, {_id: imageId, status: status})
}

function random(gender) {
  var params = {
    status: STATUS_APPROVED
  }

  if (gender) {
    params.gender = gender
  }

  return list(params)
    .then(function(matchedImages) {
      if (matchedImages.totalCount === 0) {
        return null
      }

      var imageToPick = getRandomIntInclusive(0, matchedImages.totalCount - 1)
      return matchedImages.records[imageToPick]
    })
}
