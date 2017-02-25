var joi = require('joi')
var IMAGE_CONSTANTS = require('./image-constants')
var ImageController = require('./image-controller')
var AuthController = require('../auth/auth-controller')
var UserController = require('../user/user-controller')

module.exports.basePath = '/image'
module.exports.routes = [
  {
    method: 'get',
    path: '/page/load/:id',
    summary: 'Load Image profile page',
    description: '',
    action: [AuthController.setUserToResources, ImageController.loadImagePage]
  },
  {
    method: 'get',
    path: '/page/load',
    summary: 'Image Create page',
    description: '',
    action: [AuthController.ensureAuthenticated, ImageController.loadImagePage]
  },
  {
    method: 'get',
    path: '/page/list',
    summary: 'Image list page',
    description: '',
    action: [AuthController.setUserToResources, ImageController.listImagePage]
  },
  {
    method: 'get',
    path: '/',
    summary: 'Gets all Images',
    description: '',
    action: ImageController.listImage,
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
    method: 'post',
    path: '/',
    summary: 'Creates Image',
    description: '',
    action: [AuthController.ensureAuthenticated, ImageController.createImage],
    validators: {
      body: joi.object().keys({
        url: joi.string().required(),
        createdUserId: joi.string().required(),
        gender: joi.string()
      })
    }
  },
  {
    method: 'get',
    path: '/:id',
    summary: 'Load Image profile',
    description: '',
    action: ImageController.loadImage
  },
  {
    method: 'post',
    path: '/:id/delete',
    summary: 'Delete/Restore Image profile',
    description: '',
    action: [AuthController.ensureAuthenticated, ImageController.setDeleteStatus],
    validators: {
      body: joi.object().keys({
        status: joi.boolean().default(false)
      })
    }
  },
  {
    method: 'post',
    path: '/:id/status',
    summary: 'Updates Image Status',
    description: '',
    action: [AuthController.ensureAuthenticated, UserController.isAdmin, ImageController.updateImageStatus],
    validators: {
      body: joi.object().keys({
        status: joi.string().required().allow(
          IMAGE_CONSTANTS.STATUS_REJECTED,
          IMAGE_CONSTANTS.STATUS_APPROVED
        )
      })
    }
  },
  {
    method: 'post',
    path: '/:id',
    summary: 'Updates Image profile',
    description: '',
    action: [AuthController.ensureAuthenticated, ImageController.updateImage],
    validators: {
      body: joi.object().keys({
        url: joi.string().required(),
        gender: joi.string(),
        deleted: joi.boolean().default(false)
      })
    }
  }
]
