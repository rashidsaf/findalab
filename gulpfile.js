var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var BOWER        = 'bower_components';

var autoprefixerBrowsers = {
  browsers: ['last 2 versions', 'ie >= 9'],
};

var sassPaths = [
  BOWER + '/foundation-sites/scss',
  BOWER + '/foundation-font-awesome-buttons/scss',
  BOWER + '/fontawesome/scss',
  'src',
];

gulp.task('sass', function() {
  return gulp.src('scss/*.scss')
  .pipe(sass({
    includePaths: sassPaths,
  })
  .on('error', sass.logError))
  .pipe(autoprefixer(autoprefixerBrowsers))
  .pipe(gulp.dest('css'));
});

gulp.task('stylesheet', function() {
  return gulp.src('css/findalab.scss')
  .pipe(sass(autoprefixerBrowsers))
  .pipe(gulp.dest(''));
});

gulp.task('default', ['sass', 'stylesheet'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass', 'stylesheet']);
});
