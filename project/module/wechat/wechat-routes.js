var WechatController = require('./wechat-controller')

module.exports.basePath = '/wechat'
module.exports.routes = [
  {
    method: 'get', // 微信接入服务器地址认证
    path: '/',
    summary: '',
    description: '',
    action: WechatController.wechatMsg
  },
  {
    method: 'post', // 微信信息接收
    path: '/',
    summary: '',
    description: '',
    action: WechatController.wechatMsg
  }
]
