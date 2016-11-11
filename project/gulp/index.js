var gulp = require('gulp')
var fs = require('fs')

var tasks = fs.readdirSync(__dirname + '/tasks')

tasks.forEach(function(name) {
  require('./tasks/' + name)
})

module.exports = gulp
