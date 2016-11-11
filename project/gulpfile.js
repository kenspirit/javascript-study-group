var gulp = require('./gulp')

gulp.task('test', ['test.server'])
gulp.task('default', ['lint', 'test'])
