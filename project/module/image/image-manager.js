var _ = require('lodash')
var ImageModel = require('./image-model')
var executeQuery = require('../../system/db-manager').executeQuery

module.exports = {
  list: list,
  load: load,
  create: create,
  update: update,
  remove: remove
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
