var buildApiResponse = require('./util').buildApiResponse
var logger = require('./log-manager')
var config = require('./config-manager').getConfig()
var _ = require('lodash')
var joi = require('joi')

module.exports.configureRoutes = configureRoutes

function configureRoutes(expressRouter, moduleRoutes) {
  moduleRoutes.routes.forEach(function(route) {
    var middlewares = []
    if (config.base.log.enableReqAudit) {
      middlewares.push(audit)
    }
    middlewares.push(validationMiddleware.bind(this, route))

    var handlers = [].concat(route.action)

    handlers.forEach(function(handler, index) {
      if (!handler) {
        console.error(`Non-existed route handler.
          Basepath: ${moduleRoutes.basePath}
          Path: ${route.path}
          Method: ${route.method}
          `)
      }
    })

    middlewares = middlewares.concat(route.action)

    expressRouter[route.method](route.path, middlewares)
  })
}

function validate(data, schema, errors) {
  if (schema) {
    var result = joi.validate(data, schema, {abortEarly: false})
    if (result.error) {
      errors.push(result.error)
    } else {
      _.assign(data, result.value)
    }
  }
}

function validationMiddleware(route, req, res, next) {
  var errors = []

  if (route.validators) {
    validate(req.query, route.validators.query, errors)
    validate(req.body, route.validators.body, errors)
    validate(req.params, route.validators.path, errors)
  }

  if (errors.length > 0) {
    res.status(400).json(buildApiResponse(errors, 'Validation Error'))
    return
  }

  next()
}

function audit(req, res, next) {
  logger.info({reqNoBody: req}, 'Auditing routing.')

  next()
}
