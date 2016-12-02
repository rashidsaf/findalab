var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var autoprefixerBrowsers = {
  browsers: ['last 2 versions', 'ie >= 9'],
};

gulp.task('sass', function() {
  return gulp.src('scss/findalab.scss')
  .pipe(sass(autoprefixerBrowsers))
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['sass'], function() {
  gulp.watch(['scss/findalab.scss'], ['sass']);
});
