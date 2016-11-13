var joi = require('joi')
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
    action: ImageController.createImage
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
    action: ImageController.updateImage
  },
  {
    method: 'delete',
    path: '/:id',
    summary: 'Deletes Image',
    description: '',
    action: ImageController.removeImage
  }
]
