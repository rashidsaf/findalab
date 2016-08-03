# Find A Lab - jQuery Plugin

The find a lab plugin is used throughout all of our (Medology) projects to implement our users to search
for a testing lab using their postal code and choosing a location best for them.

## Install into Project
This plugin can be installed as a bower dependency. Run the following command in the root of your project:

```bash
$ bower install findalab --save-dev
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

## Custom Settings

The plugin can be customized by redefining `findalab` settings object.

```js
<script>
$('#findalab-selector').load('../path/to/src/findalab.html', function() {
  var findalab = $(this).find('.findalab').findalab({
    baseURL: 'http://localhost:6789/',
    lab: {
      buttonText: 'Choose this place, yo!',
    },
    search: {
      buttonText: 'Find Now',
      placeholder: 'Fill in the zippaty',
    },
  });
});
</script>
```

## Development

To test and make updates to the jQuery plugin clone the repository:

```bash
$ git clone https://github.com/Medology/findalab.git && cd findalab
```

To setup your dev environment, you have to setup NPM and Bower dependencies. Run the following command in the root directory:

```bash
$ init_project
```

Next, you will want to setup and run the Docker environment by running the following command

```bash
containers up
```

You can visit the example site at [findalab.local](http://findalab.local/).

Finally, you can compile the stylesheets by running Gulp in the root directory:

```bash
$ gulp
```

Gulp includes the `sass` task that compiles the example CSS as well as the `stylesheet` task that creates the individual CSS file.

If you want to watch the files and rebuild gulp on save, use the following command

```bash
$ gulp watch
````
