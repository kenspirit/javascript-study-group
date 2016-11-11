var nodemailer = require('nodemailer')
var Promise = require('bluebird')
var logger = require('./log-manager')
var config = require('./config-manager').getConfig()

module.exports.sendEmail = sendEmail

// setup e-mail data with unicode symbols
// var mailOptions = {
//     from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
//     to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world 🐴', // plaintext body
//     html: '<b>Hello world 🐴</b>' // html body
// };
function sendEmail(mailOptions) {
  var transporter = nodemailer.createTransport(config.base.email.smtpOptions)

  // var sendMailPromise = Promise.promisify(transporter.sendMail, transporter)
  var senderName = config.base.email.sender.name
  var senderEmail = config.base.email.sender.email

  mailOptions.from = `"${senderName}" <${senderEmail}>`

  return Promise.resolve(transporter.sendMail(mailOptions))
    .then(function(info) {
      logger.info(mailOptions, 'Email sent: ' + info.response);
      return true
    })
}
