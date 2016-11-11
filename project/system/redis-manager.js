var Redis = require('ioredis')
var logger = require('./log-manager')
var config = require('./config-manager').getConfig()

var client = new Redis({
  port: config.base.redis.port,
  host: config.base.redis.host,
  retryStrategy: function (times) {
    var delay = Math.min(times * 5, 2000)
    return delay;
  }
})

client.on('error', function(err) {
  logger.error(err)
})

module.exports.getRedisClient = getRedisClient

function getRedisClient() {
  return client
}
