require('laravel-mix')
  .js('src/js/findalab.js', 'dist/findalab.min.js')
  .sass('src/scss/findalab.scss', 'dist')
  .copy('dist/findalab.css', 'dev/html/css/findalab.css')
  .copy('src/js/findalab.js', 'dist')
  .webpackConfig({
    output: {
      library: 'findALab'
    }
  });
