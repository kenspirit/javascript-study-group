var joi = require('joi')
var IMAGE_CONSTANTS = require('./image-constants')
var ImageController = require('./image-controller')

module.exports.basePath = '/image'
module.exports.routes = [
  {
    method: 'get',
    path: '/page/load/:id',
    summary: 'Load Image profile page',
    description: '',
    action: ImageController.loadImagePage
  },
  {
    method: 'get',
    path: '/page/load',
    summary: 'Image Create page',
    description: '',
    action: ImageController.loadImagePage
  },
  {
    method: 'get',
    path: '/page/list',
    summary: 'Image list page',
    description: '',
    action: ImageController.listImagePage
  },
  {
    method: 'get',
    path: '/',
    summary: 'Gets all Images',
    description: '',
    action: ImageController.listImage,
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
    method: 'post',
    path: '/',
    summary: 'Creates Image',
    description: '',
    action: ImageController.createImage,
    validators: {
      body: joi.object().keys({
        url: joi.string().required(),
        createdUserId: joi.string().required(),
        sex: joi.string()
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
    path: '/:id',
    summary: 'Updates Image profile',
    description: '',
    action: ImageController.updateImage,
    validators: {
      body: joi.object().keys({
        url: joi.string().required()
      })
    }
  },
  {
    method: 'post',
    path: '/:id/status',
    summary: 'Updates Image Status',
    description: '',
    action: ImageController.updateImageStatus,
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
    method: 'delete',
    path: '/:id',
    summary: 'Deletes Image',
    description: '',
    action: ImageController.removeImage
  }
]
