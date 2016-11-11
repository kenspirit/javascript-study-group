var uuid = require('node-uuid')
var UserManager = require('../user/user-manager')
var logger = require('../../system/log-manager')
var EmailManager = require('../../system/email-manager')
var buildApiResponse = require('../../system/util').buildApiResponse
var config = require('../../system/config-manager').getConfig()

module.exports.signinPage = signinPage
module.exports.signupPage = signupPage
module.exports.resetPasswordRequestPage = resetPasswordRequestPage
module.exports.resetPasswordPage = resetPasswordPage
module.exports.adminPage = adminPage
module.exports.signup = signup
module.exports.signin = signin
module.exports.signout = signout
module.exports.resetPasswordRequest = resetPasswordRequest
module.exports.resetPassword = resetPassword
module.exports.isPhoneUnique = isPhoneUnique
module.exports.isEmailUnique = isEmailUnique
module.exports.ensureAuthenticated = ensureAuthenticated
module.exports.isAdmin = isAdmin


function signinPage(req, res, next) {
  return res.render('auth/signin')
}

function signupPage(req, res, next) {
  return res.render('auth/signup')
}

function resetPasswordRequestPage(req, res, next) {
  return res.render('auth/resetPasswordRequest')
}

function resetPasswordPage(req, res, next) {
  var email = req.query.email
  var resetId = req.query.resetId

  UserManager.list({
    email: email,
    emailResetId: resetId
  })
  .then(function(users) {
    if (users.length === 0) {
      res.render('404')
      return
    }

    res.render('auth/resetPassword', {email: email, resetId: resetId})
  })
  .catch(next)
}

function adminPage(req, res, next) {
  return res.render('indexAdmin');
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {

    res.locals.current_user = req.user
    return next()
  }

  if (req.xhr) {
    res.status(401).json(buildApiResponse(null, 'Unauthorized.'))
  } else {
    res.redirect('/auth/signin')
  }
}

function isAdmin(req, res, next) {
  if (req.user.isAdmin() || req.user.isSupport()) {
    return next()
  }
  if (req.xhr) {
    res.status(403).json(buildApiResponse(null, 'Forbidden.'))
  } else {
    res.redirect('/')
  }
}

const COOKIE_NAME = 'evergrow'

function setCookie(req, res) {
  var cookie = {
    auth: true,
    userLoginId: req.user ? req.user.loginId : ''
  }

  res.cookie(COOKIE_NAME, cookie, { maxAge: 300000 })
}

function signup(req, res, next) {
  var loginId = req.body.loginId
  var phone = req.body.phone
  var email = req.body.email
  var password = req.body.password
  var account = {
    loginId: loginId,
    phone: phone,
    email: email,
    password: password
  }

  return UserManager.createLocal(account)
    .then(function(user) {
      logger.info(account, 'User registered successfully')

      req.login(user, function(err) {
        if (err) { return next(err) }

        // return res.redirect('/')
        res.json(buildApiResponse({loginId: req.user.loginId}))
      })
    })
    .catch(next)
}

function isPhoneUnique(req, res, next) {
  var phone = req.body.phone
  var phoneCountryCode = req.body.phoneCountryCode

  UserManager.isUnique(null, phone, phoneCountryCode)
    .then(function(notUniqueField) {
      if (notUniqueField) {
        return res.status(403).json(buildApiResponse(null, notUniqueField))
      }

      res.json(buildApiResponse())
    })
    .catch(next)
}

function isEmailUnique(req, res, next) {
  var email = req.body.email

  UserManager.isUnique(email)
    .then(function(notUniqueField) {
      if (notUniqueField) {
        return res.status(403).json(buildApiResponse(null, notUniqueField))
      }

      res.json(buildApiResponse())
    })
    .catch(next)
}

function signin(req, res, next) {
  setCookie(req, res)
  res.json(buildApiResponse({
    homeUrl: req.user.isAdmin ? '/admin' : '/'
  }))
}

function signout(req, res, next) {
  req.logout()
  req.session.destroy(function() {
    res.clearCookie(COOKIE_NAME)
    res.json(buildApiResponse())
  })
}

function resetPasswordRequest(req, res, next) {
  var email = req.body.email

  UserManager.findLocalUser(email)
    .then(function(user) {
      if (!user) {
        res.status(404).send('')
        return
      }

      var resetId = uuid.v4()
      var emailResetLink = config.base.domain + '/auth/resetPassword?resetId=' + resetId
        + '&email=' + email

      user.emailResetId = resetId

      return user.save()
        .then(function() {
          return EmailManager.sendEmail({
            to: email,
            subject: 'Reset Password Request',
            text: 'Please click below link to reset password.\n' + emailResetLink,
            html: `<h3>Please click <a href="${emailResetLink}" target="_blank">here</a> to reset password.</h3>`
          })
        })
    })
    .then(function() {
      res.send(buildApiResponse())
    })
    .catch(next)
}


function resetPassword(req, res, next) {
  var email = req.body.email
  var resetId = req.body.resetId
  var password = req.body.password

  UserManager.list({
    email: email,
    emailResetId: resetId
  })
  .then(function(result) {
    if (result.totalCount === 0) {
      res.status(403).send('')
      return
    }

    var user = result.records[0]

    return UserManager.encryptPassword(password)
      .then(function(hash) {
        user.password = hash
        return user.save()
      })
  })
  .then(function(updated) {
    req.login(updated, function(err) {
      if (err) { return next(err) }

      return res.send(buildApiResponse())
    })
  })
  .catch(next)
}
