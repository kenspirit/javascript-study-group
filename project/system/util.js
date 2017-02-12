var _ = require('lodash')

module.exports.getRandomIntInclusive = getRandomIntInclusive
module.exports.buildApiResponse = buildApiResponse
module.exports.isValidEmail = isValidEmail
module.exports.parseRequestParams = parseRequestParams
module.exports.parseResultForTable = parseResultForTable

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildApiResponse(data, err) {
  var errMessage = err || null
  if (errMessage && typeof errMessage === 'object' && errMessage.message) {
    errMessage = errMessage.message
  }

  return {
    err: errMessage,
    data: typeof data === 'boolean' ? data : (data || null)
  }
}

function isValidEmail(email) {
  var regexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return regexp.test(email)
}

function parseRequestParams(req, searchFieldName) {
  var query = req.query
  var search = query.search
  var sort = query.sort
  var order = query.order || 'desc'
  var offset = query.offset < 0 ? 0 : query.offset
  var limit = query.limit

  var params = {
    sort: sort,
    direction: order,
    limit: limit,
    page: parseInt((offset / limit) + 1)
  }

  if (search) {
    search = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')

    if (_.isArray(searchFieldName)) {
      if (searchFieldName.length > 0) {
        params['$or'] = searchFieldName.map(fieldName => {
          const searchField = {};
          searchField[fieldName] = new RegExp(search, 'i');
          return searchField
        })
      }
    } else {
      params[searchFieldName] = new RegExp(search, 'i')
    }
  }

  return params
}

function parseResultForTable(result) {
  return {
    total: result.totalCount,
    rows: result.records
  }
}
