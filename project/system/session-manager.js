var session = require('express-session')
var RedisStore = require('connect-redis')(session)
var logger = require('./log-manager')
var config = require('./config-manager').getConfig()

module.exports.initSession = initSession

function initSession(app) {
  // ttl: default to cookie maxAge or one day.  Unit is second.
  app.use(session({
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      host: config.base.redis.host,
      port: config.base.redis.port
    }),
    secret: config.base.sessionSecret,
    logErrors: logger.error.bind(logger)
  }))
}
