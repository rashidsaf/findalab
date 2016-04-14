# Medology Find A Lab Component

The find a lab component is used throughout all of our projects to implement our users to search
for a testing lab using their postal code and choosing a location best for them.

## Install
This component can be installed as a bower dependency.

Run the following command in the root of your project:
```bash
$ bower install medology-findalab --save-dev
```

## Setup

### Sass

Include the following file in your main sass file.

```sass
@import 'path/to/bower_components/medology-findalab';
```

### JS

Include `medology-findalab.js` in a script tag or concatenate it into your build file.

Include the following code to initialize the component on the page:

```js
$('put-selector-here').load('../medology-findalab.html', function() {
  $(this).find('.findalab').findalab(); // initialize findalab jQuery component
  $(document).foundation(); // initialize foundation after template loads
});
```
