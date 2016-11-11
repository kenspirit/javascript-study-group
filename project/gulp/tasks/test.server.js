var gulp = require('gulp'),
    mocha = require('gulp-mocha');

gulp.task('test.server', ['test.env'], function () {
  gulp.src([
      'test/server/global.js',
      'test/server/**/*.spec.js',
      '!test/server/**/file-manager.spec.js'
    ])
    .pipe(mocha({style: 'bdd', reporter: 'nyan', timeout: 1000}));
})
