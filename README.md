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
