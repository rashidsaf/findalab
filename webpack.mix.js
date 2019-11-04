const fs = require('fs');
const mix = require('laravel-mix');

//Create the distribution files for findalab.
mix.js('src/js/findalab.js', 'dist')
.sass('src/scss/findalab.scss', 'dist');

mix.copy('dist/findalab.css', 'dev/html/css/findalab.css');

// Iterate over each of the JS files needed for dev pages.
fs.readdirSync('./src/js/pages-test/').forEach(file => {
  mix.js('src/js/pages-test/' + file, 'dev/html/js/samples');
});
