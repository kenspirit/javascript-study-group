var jshint = require('gulp-jshint')
var gulp   = require('gulp')

gulp.task('js.lint', function() {
  return gulp.src([
      '**/*.js',
      '**/*.js',
      '*.js',
      '!public/js/lib/**/*.js',
      '!public/build/*.js',
      '!node_modules/**/*.js'
    ])
    .pipe(jshint({
      asi: true,
      curly: true,
      newcap: true,
      noempty: true,
      quotmark: true,
      undef: true,
      unused: true,
      trailing: true,
      node: true,
      browser: true,
      esversion: 6,
      expr: true,
      predef: ['expect', 'describe', 'xit', 'it', 'before', 'after', 'beforeEach', 'inject']
    }))
    .pipe(jshint.reporter('default'));
})
