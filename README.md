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

To include default pre-loader styles use the following markup (include class names and copy the images into the project folder).
everything inside the findalab-selector will be removed when the component is loaded.

```
<div id="findalab-selector">
  <div class="findalab-loading">
    <div class="findalab-loading__content">
      <h2>Loading Test Centers</h2>
      <img
        src="/three-dots.svg"
        alt="loading"
        width="50"
        onerror="this.src='/loading-gif.gif';this.onerror=null;" />
    </div>
  </div>
</div>
```

Make sure to override the height of `.findalab-loading` in each project's `settings.scss` file.
Design tip: It's best to be pixel perfect in this case and match the height of the loaded component for visual effect.

```scss
  //override the default height to match the component
  $mobile-loading-height: 461px;
  $findalab-loading: 729px;
```

## Custom Settings

The plugin can be customized by redefining `findalab` settings object.

```js
$('#findalab-selector').load('../path/to/src/findalab.html', function() {
  var findalab = $(this).find('.findalab').findalab({
    baseURL: YOUR_PROJECTS_URL,
    lab: {
      buttonText: 'Choose this place, yo!',
    },
    search: {
      buttonText: 'Find Now',
      placeholder: 'Fill in the zippaty',
    },
  });
});
```

## Development

To test and make updates to the jQuery plugin clone the repository:

```bash
$ git clone https://github.com/Medology/findalab.git && cd findalab/dev
```

To setup your dev environment, you have to setup NPM and Bower dependencies. Run the following command in the root directory:

```bash
$ init_project
```

The preceding command will initialize the file `web/.env`. Open the file and replace any placeholder environmental variables with the necessary API keys for testing.

Next, you will want to setup and run the Docker environment by running the following command

```bash
containers up
```

Update your hosts file:

```bash
echo -e "\n\
127.0.0.1 findalab.local\n\
" | sudo tee -a /etc/hosts
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
