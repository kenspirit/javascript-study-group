var WechatManager = require('./wechat-manager')

module.exports.wechatMsg = WechatManager.getWechatRouter(function(req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin
  console.log(message);

  // 自动回复处理
  if (message.MsgType === 'event' && message.Event === 'subscribe') {
    return res.reply(`关注自动回复`)
  }

  // 自动回复用户发来的图片
  if (message.MsgType === 'image') {
    return res.reply({
      type: 'image',
      content: {
        mediaId: message.MediaId // 用回微信告诉我们的用户发来的图片 MediaId
      }
    })
  }

  res.reply('')
})
