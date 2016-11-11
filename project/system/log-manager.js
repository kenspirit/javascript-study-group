var bunyan = require('bunyan')
var _ = require('lodash')
var config = require('./config-manager').getConfig()

function passwordSerializer(password) {
  return null
}

function userSerializer(user) {
  if (!user) {
    return null
  }

  return {
    name: user.name,
    _id: user._id
  }
}

function reqSerializer(req) {
  var result = reqNoBodySerializer(req)
  result.body = req.body

  return result
}

function reqNoBodySerializer(req) {
  var result = {
    method: req.method,
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    headers: _.cloneDeep(req.headers),
    params: req.params,
    query: req.query,
    requestId: req.requestId,
    remoteAddress: req.ip,
    user: userSerializer(req.user)
  }

  delete result.headers.cookie

  return result
}

var log = bunyan.createLogger({
  name: config.base.name,
  level: config.base.log.level,
  serializers: {
    req: reqSerializer,
    err: bunyan.stdSerializers.err,
    reqNoBody: reqNoBodySerializer,
    password: passwordSerializer
  }
})

module.exports = log
