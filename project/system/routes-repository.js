var routeMacther = require('path-match')({
  // path-to-regexp options
  sensitive: false,
  strict: false,
  end: true,
})

var _ = require('lodash')
var url = require('url')

var ALL_ROUTERS = {}

module.exports.setRoutes = setRoutes
module.exports.getRouteDescription = getRouteDescription

function setRoutes(basePath, route) {
  ALL_ROUTERS[basePath] = ALL_ROUTERS[basePath] || {get: [], post: []}
  ALL_ROUTERS[basePath][route.method].push(route)
}

function getUrlPathName(urlPath) {
  var pathname = url.parse(urlPath ? urlPath : '').pathname
  pathname = pathname || ''

  if (pathname !== '/' && pathname.lastIndexOf('/') === pathname.length - 1) {
    pathname = pathname.substring(0, pathname.length - 1)
  }

  return pathname
}

function getRouteDescription(req) {
  try {
    var pathname = getUrlPathName(req.url)

    var routes = ALL_ROUTERS[req.baseUrl]
    if (routes) {
      routes = routes[req.method.toLowerCase()]
    }

    if (!routes) {
      routes = []
    }

    var msg = ''
    for (var i = 0; i < routes.length; i++) {
      var route = routes[i]
      var matcher = routeMacther(route.path)
      var result = matcher(pathname)

      if (result) {
        msg = route.desc
        break
      }
    }

    return msg
  } catch(e) {
    console.log(e)
    return ''
  }
}
