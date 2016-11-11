module.exports = {
  name: 'evergrow',
  port: 3000,
  db: {
    url: 'mongodb://localhost/app'
  },
  sessionSecret: 'evergrow',
  cookieName: 'evergrow',
  redis: {
    host: 'localhost',
    port: 6379
  },
  log: {
    level: 'debug',
    enableReqAudit: true
  },
  site_static_host: '',
  upload: {
    path: './upload/'
  },
  email: {
    smtpOptions: {
      host: 'smtp.mail.me.com',
      port: 587,
      secure: true, // use SSL
      auth: {
          user: 'xxx@icloud.com',
          pass: ''
      }
    },
    sender: {
      name: 'Ken',
      email: 'xxx@icloud.com'
    }
  }
}
