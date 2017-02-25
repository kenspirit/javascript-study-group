var joi = require('joi')
var AuthController = require('../auth/auth-controller')
var UserController = require('./user-controller')

module.exports.basePath = '/user'
module.exports.routes = [
  {
    method: 'get',
    path: '/page/load/:id',
    summary: 'Load user profile page',
    description: '',
    action: [AuthController.ensureAuthenticated, UserController.loadUserPage]
  },
  {
    method: 'get',
    path: '/page/list',
    summary: 'List user page',
    description: '',
    action: [AuthController.ensureAuthenticated, UserController.isAdmin, UserController.listUserPage]
  },
  {
    method: 'get',
    path: '/',
    summary: 'Gets all users',
    description: '',
    action: [AuthController.ensureAuthenticated, UserController.isAdmin, UserController.listUser],
    validators: {
      query: joi.object().keys({
        search: joi.string().allow(''),
        order: joi.string().valid('desc', 'asc').default('asc'),
        limit: joi.number().integer().max(100).default(10),
        offset: joi.number().integer()
      })
    }
  },
  {
    method: 'get',
    path: '/:id',
    summary: 'Load user profile',
    description: '',
    action: [AuthController.ensureAuthenticated, UserController.loadUser]
  },
  {
    method: 'post',
    path: '/:id',
    summary: 'Updates user profile',
    description: '',
    action: [AuthController.ensureAuthenticated, UserController.isOwner, UserController.updateUser],
    validators: {
      body: joi.object().keys({
        loginId: joi.string().required(),
        phone: joi.string().required(),
        email: joi.string().email(),
        imageUrl: joi.string(),
        password: joi.string(),
        confirmPassword: joi.string()
      })
    }
  }
]
