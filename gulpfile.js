var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var autoprefixerBrowsers = {
  browsers: ['last 2 versions', 'ie >= 9'],
};

gulp.task('js', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/js-cookie/src/js.cookie.js'])
        .pipe(gulp.dest('js/lib/'));
});

gulp.task('sass', function() {
  return gulp.src('scss/findalab.scss')
  .pipe(sass(autoprefixerBrowsers))
  .pipe(gulp.dest('dist'));
});

gulp.task('default', ['sass', 'js']);
