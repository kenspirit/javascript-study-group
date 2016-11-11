var express = require('express')
var compression = require('compression')
var requestId = require('request-id/express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var path = require('path')
var glob = require('glob')
var Promise = require('bluebird')
var Loader = require('loader')
var _ = require('lodash')

var config = require('./config-manager').getConfig()
var initSession = require('./session-manager').initSession
var RoutesManager = require('./routes-manager')
var logger = require('./log-manager')
var buildApiResponse = require('./util').buildApiResponse

var configureAuth = require('../module/auth/auth-manager').configureAuth

var globPromise = Promise.promisify(glob)

module.exports.startServer = startServer

function startServer() {
  var app = express()

  app.disable('x-powered-by')
  app.use(compression())

  return configureApp(app)
    .then(function() {
      app.listen(app.get('port'), function() {
        logger.info('Express server listening on port ' + app.get('port'))
      })
    })
}

function configureApp(app) {
  function clientErrorHandler(err, req, res, next) {
    logger.error({err: err, req: req}, 'Uncatch: ' + err.message)

    if (req.xhr) {
      var statusCode = res.statusCode || 500
      if (statusCode == 200) {
        statusCode = 500
      }

      res.status(statusCode).json(buildApiResponse(null, err.message))
    } else {
      // next(err)
      res.status(500)
      res.render('500.html')
    }
  }

  app.set('port', config.base.port)

  // View engine
  app.set('views', './view/')
  app.set('view engine', 'html')
  app.engine('html', require('ejs-mate'))

  var assets = {}
  if (process.env.NODE_ENV === 'production') {
    try {
      assets = require('../assets.json')
    } catch (e) {
      logger.error({err: e},
        'Must build assets.json if running in production mode')
      throw e
    }
  }

  _.extend(app.locals, {
    _layoutFile: 'common/layout.html',
    Loader: Loader,
    assets: assets,
    config: config
  })

  // 静态文件目录
  var staticDir = path.join(__dirname, '../public')
  app.use('/public', express.static(staticDir))

  // Init Middleware
  initSession(app)

  app.use(cookieParser())
  app.use(bodyParser.json({limit: '50mb'}))
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }))

  // Authentication
  configureAuth(app)

  // Routes
  app.use(requestId())

  return Promise.all([
      configureRoutes(app, '', '../module/**/*-routes\.js')
    ])
    .then(function() {
      // error handling middleware should be loaded after loading the routes
      app.use(clientErrorHandler)
      app.use(function(req, res) {
        res.status(404)
        res.render('404.html')
      })
    })
}

function configureRoutes(app, pathPrefix, routesPathGlob) {
  return globPromise(path.resolve(__dirname, routesPathGlob), {})
    .then(function(files) {
      files.forEach((file) => {
        var router = express.Router()
        var moduleFile = path.relative(__dirname, file)
        var moduleRoutes = require('./' + moduleFile)

        RoutesManager.configureRoutes(router, moduleRoutes)

        app.use(pathPrefix + moduleRoutes.basePath, router)
      })

      return true
    })
}
