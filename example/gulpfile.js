var gulp        = require('gulp');
var $           = require('gulp-load-plugins')();
var php         = require('gulp-connect-php');
var browserSync = require('browser-sync').create();
var BOWER       = 'bower_components';

var sassPaths = [
  BOWER + '/foundation-sites/scss',
  BOWER + '/foundation-font-awesome-buttons/scss',
  BOWER + '/fontawesome/scss',
];

gulp.task('sass', function() {
  return gulp.src('scss/*.scss')
  .pipe($.sass({
    includePaths: sassPaths,
  })
  .on('error', $.sass.logError))
  .pipe($.autoprefixer({
    browsers: ['last 2 versions', 'ie >= 9'],
  }))
  .pipe(gulp.dest('css'));
});

gulp.task('stylesheet', function() {
  return gulp.src('scss/findalab.scss')
  .pipe($.sass({
    browsers: ['last 2 versions', 'ie >= 9'],
  })
  .pipe(gulp.dest('../css'));
});

gulp.task('default', ['sass', 'stylesheet'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass', 'stylesheet']);
  gulp.watch('*.html').on('change', browserSync.reload);
});
