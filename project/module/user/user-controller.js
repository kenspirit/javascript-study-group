var UserManager = require('./user-manager')
var buildApiResponse = require('../../system/util').buildApiResponse
var logger = require('../../system/log-manager')

module.exports.listUserPage = listUserPage
module.exports.loadUserPage = loadUserPage
module.exports.isOwner = isOwner
module.exports.listUser = listUser
module.exports.loadUser = loadUser
module.exports.updateUser = updateUser

function listUserPage(req, res, next) {
  res.render('user/list', {
    id: req.params.id,
    isEditable: req.user._id.toString() == req.params.id
  })
}

function loadUserPage(req, res, next) {
  res.render('user/profile', {
    id: req.params.id,
    isEditable: req.user._id.toString() == req.params.id
  })
}

function isOwner(req, res, next) {
  if (req.params.id !== req.user._id.toString()) {
    res.status(403).json(buildApiResponse(null, 'Forbidden.'))
    return
  }

  next()
}

function listUser(req, res, next) {
  UserManager.list(req.query)
    .then(function(users) {
      res.json(buildApiResponse(users))
    })
    .catch(next)
}

function loadUser(req, res, next) {
  UserManager.load(req.params.id)
    .then(function(user) {
      res.json(buildApiResponse(user))
    })
    .catch(next)
}

function updateUser(req, res, next) {
  var requestUser = {
    _id: req.params.id,
    loginId: req.body.loginId,
    email: req.body.email,
    phone: req.body.phone
  }

  if (req.body.imageUrl) {
    requestUser.imageUrl = req.body.imageUrl
  }

  if (req.body.password) {
    requestUser.password = req.body.password
  }

  if (req.body.password && !UserManager.isPasswordInCorrectFormat(requestUser.password)) {
    res.status(400).json(buildApiResponse(null, new Error('INVALID_PWD_FORMAT')))
    return
  }

  UserManager.update(requestUser)
    .then(function(updatedUser) {
      res.json(buildApiResponse(updatedUser))
    })
    .catch(function(err) {
      logger.error({req: req, err: err}, 'Failed to update user.')

      res.status(500).json(buildApiResponse(null, 'Failed to update user.'))
    })
}

