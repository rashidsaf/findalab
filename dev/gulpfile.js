var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var BOWER        = 'bower_components';

var autoprefixerBrowsers = {
  browsers: ['last 2 versions', 'ie >= 9'],
};

gulp.task('stylesheet', function() {
  return gulp.src('src/findalab.scss')
  .pipe(sass(autoprefixerBrowsers))
  .pipe(gulp.dest('css'));
});

gulp.task('default', ['stylesheet'], function() {
  gulp.watch(['src/*.scss'], ['stylesheet']);
});
