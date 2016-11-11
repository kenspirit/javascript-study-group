var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var UserManager = require('../user/user-manager')
var logger = require('../../system/log-manager')

module.exports.configureAuth = configureAuth
module.exports.localAuth = localAuth

function localAuth() {
  return passport.authenticate('local', {failWithError: true})
}

function configureAuth(app) {
  app.use(passport.initialize())
  app.use(passport.session())
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  UserManager.load(id)
    .then(function(user) {
      done(null, user)
    })
})

passport.use(new LocalStrategy({
    usernameField: 'loginId',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, loginId, password, verified) {
    if (!loginId || !password) {
      verified(null, false, {message: 'Invalid login info.'}) // err, user, info
      return
    }

    UserManager.findLocalUser(loginId)
      .then(function(user) {
        return UserManager.validatePassword(password, user)
          .then(function(isValid) {
            if (user) {
              delete user.password
            }

            return isValid ? user : null
          })
      })
      .then(function(user) {
        if (user === null) {
          verified(null, false, {message: 'Invalid login info.'})
          return
        }

        logger.info({req: req}, 'User Login successfully')
        verified(null, user)
      })
      .catch(verified)
  }))
