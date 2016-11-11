var HomeController = require('./home-controller')

module.exports.basePath = '/'
module.exports.routes = [
  {
    method: 'get',
    path: '/',
    action: HomeController.homePage
  }
]
