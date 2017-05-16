# Changelog

See the [release page] for authors, detailed dates, commit hashes and available downloads.

## v2.7.1 - Lab result auto scroll

- **New Feature:** When a lab marker on the map view is selected (mouse click), its result in the left side search column will be auto scrolled and appears in that column.

## v2.7.0 - Recommended Networks Tag

- **New Feature:** Can set recommended lab network for the lab search.
- **New Feature:** All recommended lab network should be shown with a "recommended" tag and the icon marker on the map is a different color.

## v2.6.3 - User Location Updates

- **Changes:** Fixed a bug that caused the user location location feature to break on one of our projects (due to jQuery ajaxSetup conflicts).
- **Additional:** Added a loading state to the user location UI.

## v2.6.2 - UI Updates for day filter

The font style for label of each day filter option changed from regular to bold

## v2.6.1 - Layout and styling change for Day Filter

* Day Filter
  * Layout change
  * Styling change
* SCSS file clean up

## v2.6.0 - Day of Week Filters 

- Can filter the search result to only show the labs with hours for specific day (open on that day), hide other labs.
- When user switch between regular lab and saturday lab, the result should be refreshed

## v2.5.3 - Update Documentation

Improve documentation, remove some redundent code.

## v2.5.2 - Disable findalab elements while processing

Functions have been added, and tested, which can be leveraged from individual projects to disable findalab form elements while requests are being processed.

## v2.5.1 - IHC Bug fixes and optimizations

- Only render the ihc pin if `hasPhlebotomists`
- Fix ihc and labs into bounds
- Fix minimum zoom for map rendering
- Add more pages with data types for testing
- Remove unused variable and whitespace
- Simplify vMarker for ihc show marker function
- Break apart reset function
- Reset results and map makers on search submit
- Add Map Context for pin counting on Google Maps
- Update the baseURL for labs-results page (it was incorrect)
- Render results total including labs and ihc
- Test Results in Google Maps
- Add semicolons to the end of functions
- Explicitly check ihc isn't visible on lab results

## v2.5.0  - IHC Map Makers

This release adds a single map marker for in-home collection.

### Depreciated Changes

There have been minor changes to the settings that have

The following `googleMap` properties...

```scss
mapMarkerFillColor: '#3398db',
mapMarkerHoverFillColor: '#eb4d4c'
```

...should be changed to the following values:

```scss
 labMarkerFillColor: '#3398db',
 markerHoverFillColor: '#eb4d4c'
```

### New Feature

 And the following setting can be added to `googleMap` for the ihc marker color:

```scss
 ihcMarkerFillColor: '#73c6eb',
```
