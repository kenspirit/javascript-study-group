var joi = require('joi')
var AuthController = require('../auth/auth-controller')
var FileController = require('./file-controller')

module.exports.basePath = '/file'
module.exports.routes = [
  {
    method: 'post',
    path: '/upload',
    summary: 'Updates file',
    description: '',
    action: [AuthController.ensureAuthenticated, FileController.uploadRequestFileMiddleware]
  }
]
