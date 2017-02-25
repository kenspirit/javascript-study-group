var mongoose = require('mongoose')
var config = require('./config-manager').getConfig()
var path = require('path')
var Promise = require('bluebird')
var glob = require('glob')
var _ = require('lodash')

var globPromise = Promise.promisify(glob)

mongoose.Promise = Promise

module.exports.initDB = initDB
module.exports.executeQuery = executeQuery

function initDB() {
  return mongoose.connect(config.base.db.url)
    .then(initSchema)
}

function initSchema() {
  return globPromise(path.resolve(__dirname, '../module/**/*-model\.js'), {})
    .then(function(files) {
      files.forEach((file) => {
        var modelFile = path.relative(__dirname, file)
        require('./' + modelFile)
      })

      return true
    })
}

function executeQuery(model, queryRequest) {
  var query = model.find(getQueryCriteria(queryRequest))

  var sort = queryRequest.sort
  var direction = queryRequest.direction === 'asc' ? 1 : -1 // desc by default
  var limit = queryRequest.limit || 20
  var page = queryRequest.page || 0

  if (sort) {
    var sorting = {}
    sorting[sort] = direction
    query = query.sort(sorting)
  }
  if (limit) {
    query = query.limit(limit)
  }
  if (page) {
    query.skip((page - 1) * limit)
  }

  return query.exec()
    .then(function(results) {
      if (!page) {
        return {
          records: results,
          totalCount: results.length,
          page: page
        }
      }

      // paging.  Need to get total count also
      return model.count(getQueryCriteria(queryRequest))
        .then(function(count) {
          return {
            records: results,
            totalCount: count,
            page: page
          }
        })
    })
}

function getQueryCriteria(criteria) {
  return _.reduce(criteria, function(query, fieldValue, fieldName) {
    if (fieldValue === null || fieldValue === undefined ||
        (typeof fieldValue === 'string' && fieldValue.length === 0) ||
        ['sort', 'direction', 'limit', 'page'].indexOf(fieldName) > -1) {
      return query
    }

    if (_.isArray(fieldValue) && fieldName !== '$or') {
      query[fieldName] = {$in: fieldValue}
    } else {
      query[fieldName] = fieldValue
    }
    return query
  }, {})
}
