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
    summary: 'Load user profile page',
    description: '',
    action: [AuthController.ensureAuthenticated, UserController.listUserPage]
  },
  {
    method: 'get',
    path: '/',
    summary: 'Gets all users',
    description: '',
    action: [AuthController.ensureAuthenticated, UserController.listUser],
    validators: {
      query: joi.object().keys({
        sort: joi.string().valid('createdAt', 'updatedAt'),
        direction: joi.string().valid('desc', 'asc').default('desc'),
        limit: joi.number().integer().max(100).default(10),
        page: joi.number().integer()
      }).with('sort', 'direction')
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
        password: joi.string(),
        confirmPassword: joi.string()
      })
    }
  }
]
