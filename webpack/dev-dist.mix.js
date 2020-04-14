require('laravel-mix')
  .js('src/js/findalab.js', 'dist')
  .sass('src/scss/findalab.scss', 'dist')
  .copy('dist/findalab.css', 'dev/html/css/findalab.css')
  .webpackConfig({
    output: {
      library: '',
      libraryTarget: 'commonjs-module'
      }
  });
