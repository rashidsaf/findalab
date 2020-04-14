const fs = require('fs');
const mix = require('laravel-mix');

// Iterate over each of the JS files needed for dev pages.
fs.readdirSync('./src/js/pages-test/').forEach(file => {
  mix.js('src/js/pages-test/' + file, 'dev/html/js/samples');
});
