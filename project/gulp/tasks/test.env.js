var gulp   = require('gulp')

gulp.task('test.env', function() {
  return process.env.NODE_ENV === 'test'
})
