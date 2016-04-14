var gulp  = require('gulp');
var $     = require('gulp-load-plugins')();
var BOWER = 'bower_components';

var sassPaths = [
  BOWER + '/foundation-sites/scss',
  BOWER + '/foundation-font-awesome-buttons/scss',
  BOWER + '/fontawesome/scss',
];

gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9'],
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('default', ['sass'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
});
