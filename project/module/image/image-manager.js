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
  remove: remove,
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

function update(entity) {
  return load(entity._id)
    .then(function(dbEntity) {
      if (!dbEntity) {
        return false
      }
      delete entity._id

      _.assign(dbEntity, entity)

      return dbEntity.save()
    })
}

function remove(entityId, isPhysical) {
  if (!isPhysical) {
    return ImageModel.update({_id: entityId}, {deleted: true}).exec()
  } else {
    return ImageModel.remove({_id: entityId})
  }
}

function updateStatus(imageId, status) {
  return update({_id: imageId, status: status})
}

function random(sex) {
  var params = {
    status: STATUS_APPROVED
  }

  if (sex) {
    params.sex = sex
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
