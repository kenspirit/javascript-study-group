var _ = require('lodash')
var Promise = require('bluebird')
var wechat = require('wechat')
var WechatAPI = require('wechat-api')

var UserManager = require('../user/user-manager')
var config = require('../../system/config-manager').getConfig()
var redisClient = require('../../system/redis-manager').getRedisClient()

module.exports = {
  find: find,
  createOrUpdate: createOrUpdate,
  getWechatRouter: getWechatRouter,
  getLatestToken: getLatestToken,
  getMediaUrl: getMediaUrl
}

function find(openid) {
  return UserManager.list({'wechat.openid': openid})
    .then(function(result) {
      if (result.records.length > 0) {
        return result.records[0]
      }

      return null
    })
}

function createOrUpdate(userInfo) {
  return find(userInfo.openid)
    .then(function(user) {
      if (!user) {
        user = {
          wechat: userInfo
        }

        return UserManager.create(user)
      }

      user.wechat = userInfo

      return user.save()
    })
}

/**
 * Below code is for initializing wechat
 */

var appToken = config.wechat.appToken
var appid = config.wechat.appId
var appsecret = config.wechat.appSecret

var wechatConfig = {
  token: appToken,
  appid: appid
}

function getUserToken(openid, callback) {
  redisClient.get('access_token:' + openid)
   .then(function(userToken) {
     callback(null, JSON.parse(userToken))
     return null
   })
   .catch(callback)
}

function setUserToken(openid, token, callback) {
  redisClient.set('access_token:' + openid, JSON.stringify(token))
   .then(function(userToken) {
     callback(null, token)
     return null
   })
   .catch(callback)
}

var api = Promise.promisifyAll(
  new WechatAPI(appid, appsecret, getGlobalToken, setGlobalToken)
)
api.registerTicketHandle(getTicket, saveTicket)

function getGlobalToken(callback) {
  redisClient.get('global_access_token')
   .then(function(globalToken) {
     callback(null, JSON.parse(globalToken))
     return null
   })
   .catch(callback)
}

function setGlobalToken(token, callback) {
  redisClient.set('global_access_token', JSON.stringify(token))
   .then(function(globalToken) {
     callback(null, token)
     return null
   })
   .catch(callback)
}

function getTicket(type, callback) {
 redisClient.get('weixin_jsticket')
   .then(function(ticket) {
     callback(null, JSON.parse(ticket))
     return null
   })
   .catch(callback)
}

function saveTicket(type, _ticketToken, callback) {
 redisClient.set('weixin_jsticket', JSON.stringify(_ticketToken))
   .then(function(ticket) {
     callback(null, _ticketToken)
     return null
   })
   .catch(callback)
}

function getWechatRouter(cb) {
  return wechat(wechatConfig, cb)
}

function getLatestToken() {
  return api.getLatestTokenAsync()
}

function getMediaUrl(mediaId) {
  return getLatestToken()
    .then(function(token) {
      return `https://api.weixin.qq.com/cgi-bin/media/get?access_token=${token.accessToken}&media_id=${mediaId}`
    })
}
