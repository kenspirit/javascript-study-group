var _ = require('lodash')
var bcrypt = require('bcrypt')
var Promise = require('bluebird')
var userModel = require('./user-model')
var executeQuery = require('../../system/db-manager').executeQuery
var isValidEmail = require('../../system/util').isValidEmail

var hashPromise = Promise.promisify(bcrypt.hash)
var comparePromise = Promise.promisify(bcrypt.compare)

module.exports = {
  list: list,
  load: load,
  create: create,
  createLocal: createLocal,
  remove: remove,
  update: update,
  findLocalUser: findLocalUser,
  encryptPassword: encryptPassword,
  validatePassword: validatePassword,
  isPasswordInCorrectFormat: isPasswordInCorrectFormat,
  isUnique: isUnique
}

function list(queryRequest) {
  return executeQuery(userModel, queryRequest)
}

function load(id) {
  return userModel.findOne({_id: id}).exec()
}

function findLocalUser(loginId) {
  var criteria = {}
  if (isValidEmail(loginId)) {
    criteria.email = loginId
  } else if (/^[0-9]+$/.test(loginId)) {
    criteria.phone = loginId
    criteria.phoneCountryCode = '86'
  } else {
    criteria.loginId = loginId
  }

  return userModel.findOne(criteria).exec()
}

function isUnique(loginId, email, phone, phoneCountryCode) {
  var criteria = []
  if (loginId) {
    criteria.push({loginId: loginId})
  }
  if (email) {
    criteria.push({email: email})
  }
  if (phone) {
    criteria.push({phone: phone, phoneCountryCode: phoneCountryCode || '86'})
  }

  if (criteria.length > 1) {
    criteria = {'$or': criteria}
  } else {
    criteria = criteria[0]
  }

  return userModel.findOne(criteria)
    .then(function(dbUser) {
      if (!dbUser) {
        return null
      }

      if (dbUser.email === email) {
        return 'email'
      } else if (dbUser.loginId === loginId) {
        return 'loginId'
      } else {
        return 'phone'
      }
    })
}

function encryptPassword(password) {
  return hashPromise(password, 8)
}

function validatePassword(inputPassword, user) {
  if (!user) {
    return Promise.resolve(false)
  }

  return comparePromise(inputPassword, user.password);
}

function isPasswordInCorrectFormat(inputPassword) {
  var pwd = inputPassword || ''

  if (pwd.length < 8 || pwd.length > 16) {
    return false
  }

  var metCriteria = 0
  if (/\d/.test(pwd)) { // Digits
    metCriteria++
  }
  if (/[a-zA-Z]/.test(pwd)) { // Alph
    metCriteria++
  }
  if (/[`~!@#%-_=;:''<>,/}\$\^\.\&\*\+\(\)\+\{\[\]\|\?\\]/.test(pwd)) { // Special Characters
    metCriteria++
  }
  if (/\S/.test(pwd)) { // Non whitespace
    metCriteria++
  }
  if (metCriteria < 3) {
    return false
  }

  return true
}

function create(user) {
  return userModel.create(user)
}

function createLocal(user) {
  return isUnique(user.loginId, user.email, user.phone, user.phoneCountryCode)
    .then(function(notUniqueField) {
      if (notUniqueField) {
        throw new Error(notUniqueField.toUpperCase() + '_NOT_UNIQUE')
      }

      return encryptPassword(user.password)
    })
    .then(function(hash) {
      user.password = hash

      return userModel.create(user)
    })
}

function remove(userId, isPhysical) {
  if (!isPhysical) {
    return load(userId)
      .then(function(dbUser) {
        if (!dbUser) {
          return false
        }

        dbUser.deleted = true
        return dbUser.save()
      })
  } else {
    return userModel.remove({_id: userId})
  }
}

function update(user) {
  return load(user._id)
    .then(function(dbUser) {
      if (!dbUser) {
        return false
      }
      delete user._id

      _.assign(dbUser, user)

      if (user.password) {
        return encryptPassword(user.password)
          .then(function(hash) {
            dbUser.password = hash
            return dbUser
          })
      }

      return dbUser
    })
    .then(function(dbUser) {
      return dbUser.save()
    })
}
