var heapdump = require('heapdump')
var initDB = require('./system/db-manager').initDB
var startServer = require('./system/server-manager').startServer
var logger = require('./system/log-manager')

initDB()
  .then(startServer)
  .catch(function(error) {
    logger.error(error)
  })
