# Find A Lab - jQuery Plugin

The find a lab plugin is used throughout all of our (Medology) projects to implement our users to search
for a testing lab using their postal code and choosing a location best for them.

## Install
This plugin can be installed as a bower dependency. Run the following command in the root of your project:

```bash
$ bower install medology-findalab --save-dev
```

## Requirements

The `findalab` plugin requires the following dependencies:
- jQuery
- findalab.js
- findalab.css

Make sure to load the scripts and stylesheets when using the plugin.

## Setup

Include the following code to initialize the plugin on the page:

```js
$('#your-selector').load('../path/from/bower/findalab.html', function() {
  $(this).find('.findalab').findalab();
});
```

## Custom Options

The plugin can be customized by redefining `findalab` variables.

Here is an example using [Foundation Font Awesome Buttons](https://github.com/joshmedeski/foundation-font-awesome-buttons):

```js
$('#your-selector').load('../path/from/bower/findalab.html', function() {
  $(this).find('.findalab').findalab();
  findalab.searchbuttonClass = 'secondary button';
  findalab.searchButtonText = '<i class="fa fa-search"></i>';
  findalab.searchButtonLoadingText = '<i class="fa fa-spin fa-refresh"></i>';
  findalab.labSelectedButtonClass = 'small secondary button ffab-after fa-arrow-right';
});
```

## Testing

To test and make updates to the jQuery plugin clone the repository:

```bash
$ git clone https://github.com/Medology/findalab.git && cd findalab
```

To setup your dev environment, you have to setup NPM and Bower dependencies. Run the following commands in the root directory:

```bash
$ npm install
$ bower install foundation-font-awesome-buttons
```

Next, you will want to setup a local server to run the files:

```bash
$ php -S localhost:6789
```

__*Note:__ port 6789 is has been setup for the example pages.

You can visite the simple site at [localhost:6789/simple.html](http://localhost:6789/simple.html) or the Foundation Font Awesome Button version at [localhost:6789/foundation.html](http://localhost:6789/foundation.html).

Finally, you can compile the stylesheets by running Gulp in the root directory:

```bash
$ gulp
```

Gulp includes the `sass` task that compiles the example CSS as well as the `stylesheet` task that creates the individual CSS file.
