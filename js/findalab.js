/**
 * @module medology/findalab
 */
(function($) {

  "use strict";

  $.fn.extend({

    /**
     * Controller for Lab Search component.
     *
     * @class Findalab
     * @extends jQuery.fn
     * @param {FindalabSettings} settings
     * @returns {Findalab}
     */
    findalab: function(settings) {
      var self = this;

      /**
       * Settings for Lab Search.
       *
       * @typedef {object} FindalabSettings
       * @property {InHomeCollectionSetting} inHomeCollection In-home collection setting.
       * @property {InputGroupSetting}       inputGroup       Search form setting.
       * @property {GoogleMapsSetting}       googleMaps       Google map API setting.
       * @property {SearchSetting}           search           Search preference setting.
       * @property {DayOfWeekFilterSetting}  dayOfWeekFilter  Saturday hours filter setting.
       * @property {UserLocationSetting}     userLocation     User current location setting.
       */
      this.settings = {
        baseURL: 'http://findalab.local/',
        searchURL: {
          labs: 'labs',
          phlebotomists: 'phlebotomists'
        },
        /**
         * Setting for the google maps API.
         *
         * @typedef {object} GoogleMapsSetting
         * @property {float}                  defaultLat           Default latitude.
         * @property {float}                  defaultLong          Default longitude.
         * @property {google.maps.Geocoder}   geoCoder             Define the Geocoder to be used.
         * @property {google.maps.InfoWindow} infoWindow           Define the Info Window to be attached.
         * @property {string}                 ihcMarkerFillColor   Define the fill color of In-home collection marker.
         * @property {int}                    initialZoom          Define the initial zooming level.
         * @property {string}                 labMarkerFillColor   Define the fill color of lab marker.
         * @property {google.maps.Map}        map                  Define the Map to be used.
         * @property {string}                 markerHoverFillColor Define the fill color when lab/ihc is hovered.
         * @property {google.maps.Marker[]}   markers              The initial Markers.
         * @property {string}                 resultsZoom          The zoom level for when there are search results.
         */
        googleMaps: {
          defaultLat: 39.97712, // TODO: Address Canada's default lat
          defaultLong: -99.587403, // TODO: Address Canada's default long
          geoCoder: null,
          infoWindow: null,
          initialZoom: 4,
          map: null,
          markers: [],
          resultsZoom: 10,
          labMarkerFillColor: '#3398db',
          ihcMarkerFillColor: '#73c6eb',
          markerHoverFillColor: '#eb4d4c'
        },
        /**
         * Setting for the search function.
         *
         * @typedef {object} SearchFunctionSetting
         * @property {string} excludeNetworks The lab network to be excluded (black-list).
         * @property {string} limit           Limit the number of search result.
         * @property {string} onlyNetwork     The lab network to be included (white-list).
         */
        searchFunction: {
          excludeNetworks: undefined,
          limit: undefined,
          onlyNetwork: undefined
        },
        /**
         * Setting for the lab item in the search result.
         *
         * @typedef {object} LabSetting
         * @property {string}  buttonClass The class name of the button.
         * @property {string}  buttonText  The label text of the button.
         * @property {boolean} hasButton   If the button should be displayed.
         */
        lab: {
          hasButton: true,
          buttonClass: null,
          buttonText: 'Choose This Location'
        },
        /**
         * Setting for the search form.
         *
         * @typedef {object} InputGroupSetting
         * @property {string} button    The class name for the search button.
         * @property {string} container The class name for the search form container.
         * @property {string} field     The class name for the search field.
         */
        inputGroup: {
          container: 'input-group',
          field: 'input-group-field',
          button: 'input-group-button'
        },
        /**
         * More setting for the search form.
         *
         * @typedef {Object} SearchSetting
         * @property {string} buttonClass           The class name for the search button.
         * @property {string} buttonLoadingText     The loading text when search button is clicked and waiting results.
         * @property {string} buttonText            The label text of the search button.
         * @property {string} inputGroupButtonClass The class name for the inputGroup button.
         * @property {string} inputGroupClass       The class name for the inputgroup.
         * @property {string} inputType             The type of the input form field.
         * @property {string} inputGroupFieldClass  The class of the input form field.
         * @property {string} placeholder           The place holder text when search criteria is not entered.
         * @property {string} title                 The title of the search field.
         */
        search: {
          title: 'Test Centers',
          buttonClass: null,
          buttonLoadingText: '...',
          buttonText: 'Search',
          inputGroupButtonClass: null,
          inputGroupClass: null,
          inputGroupFieldClass: null,
          placeholder: 'Enter your zip',
          inputType: 'text'
        },
        /**
         * Setting for in-home collection feature.
         *
         * @typedef {Object} InHomeCollectionSetting
         * @property {string}  button        The label text for the select button.
         * @property {string}  buttonClass   The class name for the select button.
         * @property {string}  description   The description of in-home feature.
         * @property {string}  notice        The notice of in-home feature.
         * @property {boolean} showComponent Enable/disable the in-home collection feature.
         * @property {string}  title         The title of the in-home collection feature.
         * @property {string}  timeTitle     The title of the time section.
         * @property {string}  timeDetails   The detail of the time section.
         */
        inHomeCollection: {
          showComponent: true,
          title: 'In-Home Collection',
          description: 'Get the lab to come to you. Schedule an in-home appointment with a Lab Collection Specialist',
          timeTitle: 'Available:',
          timeDetails: '7:00am - 8:00pm, 7 days a week',
          button: 'Select &amp; Continue',
          buttonClass: 'button',
          notice: '*You will schedule your appointment during checkout.'
        },
        /**
         * Setting for the user location detection feature.
         *
         * @typedef {Object} UserLocationSetting
         * @property {string}  icon       The class name for the icon.
         * @property {string}  msg        The message of the link.
         * @property {boolean} showOption Enable/disable user location detection feature.
         */
        userLocation: {
          showOption: false,
          icon: 'fa fa-map-marker',
          msg: 'Or use current location'
        },
        /**
         * Setting for the radio buttons to filter labs with saturday hours.
         *
         * @typedef {Object} DayOfWeekFilterSetting
         * @property {string}  radioAllText  The label of the radio button to show all lab.
         * @property {string}  radioDaysText The label of the radio button to show labs with saturday hours.
         * @property {boolean} showOption    Enable/disable the saturday filter feature.
         */
        dayOfWeekFilter: {
          showOption: false,
          radioAllText: 'All',
          radioDaysText: {
              6 : 'Have Saturday Hours'
          },
          dayOnly: null
        },
        emptyResultsMessage: '',
        noResultsMessage: '',
        cannotGeolocateMessage: '',
        invalidPostalCodeMessage: ''
      };

      this.settings = $.extend(true, this.settings, settings);

      this.emptyResultsMessage = 'Please "' + this.settings.search.placeholder + '" above and press "' +
      this.settings.search.buttonText + '" to see results.';

      this.noResultsMessage = 'Oops! Sorry, we could not find any testing centers near that location. ' +
      'Please try your search again with a different or less specific address.';

      this.cannotGeolocateMessage = 'Oops! Sorry, we could not detect your location. ' + this.emptyResultsMessage;

      this.invalidPostalCodeMessage = 'Oops! Invalid postal code: please enter a valid postal code and search again.';

      this.searchDesc = 'Please note that these ' + this.settings.search.title + ' do not accept payment. You must ' +
                        'place your order and submit payment over the phone or online before visiting any of the ' +
                        this.settings.search.title + '.';

      this.mapMarker  = {
          path: 'm-13.86316,-25.61974l10.845,22.96658c0.31974,0.69158 0.79816,1.17' +
          ' 1.38316,1.54184c0.63711,0.37184 1.32868,0.585 2.02026,0.585c0.69158,0 1.38079,-0.21316' +
          ' 2.02027,-0.585c0.585,-0.37184 1.06342,-0.85026' +
          ' 1.38079,-1.54184l10.845,-22.96658c0.63947,-1.38079 0.95684,-3.13579' +
          ' 0.95684,-5.31473c0,-4.14711 -1.48737,-7.76132 -4.46448,-10.68632c-2.9771,-2.9771' +
          ' -6.53921,-4.46447 -10.73842,-4.46447c-4.19921,0 -7.76131,1.48737' +
          ' -10.73842,4.46447c-2.9771,2.925 -4.46684,6.53921 -4.46684,10.68632c0,2.17894' +
          ' 0.31974,3.93394 0.95684,5.31473l0,0zm14.24842,-12.86289c2.07237,0 3.87948,0.74368' +
          ' 5.36921,2.23105c1.48737,1.48974 2.23342,3.24237 2.23342,5.31711c0,2.12447 -0.74605,' +
          ' 3.87947 -2.23342,5.36921c-1.48973,1.48737 -3.29684,2.23105 -5.36921,2.23105c-2.07473,' +
          ' 0 -3.88184,-0.74368 -5.36921,-2.23105c-1.48973,-1.48974 -2.23342,-3.24474' +
          ' -2.23342,-5.36921c0,-2.07474 0.74369,-3.82737 2.23342,-5.31711c1.48737,-1.48737' +
          ' 3.29448,-2.23105 5.36921,-2.23105l0,0z',
          fillColor: self.settings.googleMaps.labMarkerFillColor,
          fillOpacity: 1,
          scale: 1,
          strokeColor: 'white',
          strokeWeight: 2
        };

      this.ihcMapMarker = $.extend(true, {}, this.mapMarker);
      this.ihcMapMarker.fillColor = self.settings.googleMaps.ihcMarkerFillColor;

      this.mapMarkerHover = $.extend(true, {}, this.mapMarker);
      this.mapMarkerHover.fillColor = self.settings.googleMaps.markerHoverFillColor;

      this.labs = [];

      this.bounds = null;

      this.myLab = null;

      /**
       * Initializes the map and sets the default viewport lat / long.
       *
       * @param {FindalabSettings} settings
       */
      this.construct = function(settings) {
        self._setMessage(this.emptyResultsMessage);

        self._constructInHomeCollection(settings.inHomeCollection);

        self._constructSearch(settings.search, settings.inputGroup);

        this.find('[data-findalab-search-field]')
            .keydown($.proxy(onSearchKeyDown, this))
            .keyup($.proxy(onSearchKeyUp, this));

        self._constructGoogleMaps(settings.googleMaps);

        this._contentNav();

        if (settings.userLocation.showOption) {
          _constructUserLocation(settings.userLocation);
        } else {
          $('[data-findalab-user-location]').remove();
        }

        if (settings.dayOfWeekFilter.showOption) {
          self._constructDayOfWeekFilter(settings.dayOfWeekFilter);
        } else {
          $('[data-findalab-day-filter]').remove();
        }

        this.fadeIntoView();

        // Capture lab selection events
        this.on('click', '[data-findalab-result-button]', $.proxy(onLabSelectClick, this));
        this.on('mouseenter','[data-findalab-result]', $.proxy(onLabHover, this));
        this.on('mouseleave','[data-findalab-result]', $.proxy(onLabMarkerUnhover, this));
        this.on('mouseenter','[data-findalab-ihc]', $.proxy(onPhlebotomistsHover, this));
        this.on('mouseleave','[data-findalab-ihc]', $.proxy(onIhcMarkerUnhover, this));

        /**
         * Prevents submission of the form on key down.
         *
         * @param {document#event:generic} event The key down event.
         * @listens document#event:generic
         * @returns {boolean}   False if the enter key was pressed. This prevents bubbling.
         */
        function onSearchKeyDown(event) {
          if (event.keyCode === 13) {
            event.preventDefault();

            return false;
          }
        }

        /**
         * Triggers a search if the enter key was pressed.
         *
         * @this  {Findalab}               The find a lab instance.
         * @param {document#event:generic} event The key down event.
         * @listens document#event:generic
         * @returns {boolean} Always false to prevent bubbling.
         */
        function onSearchKeyUp(event) {
          event.preventDefault();

          if (event.keyCode == 13) {
            this._onSearchSubmit(event);
          }

          return false;
        }

        /**
         * Calls the `onLabSelect` method when a lab is selected.
         *
         * @this    {Findalab}               The find a lab instance.
         * @param   {document#event:generic} event The key down event.
         * @listens document#event:generic
         * @returns {boolean} Always false to prevent bubbling.
         */
        function onLabSelectClick(event) {
          event.preventDefault();
          this._onLabSelect($(event.target).data());

          return false;
        }

        /**
         * Is called when user hovers on a result and causes the corresponding map pin to change
         *
         * @this    {Findalab}               The find a lab instance.
         * @param   {document#event:generic} event the mouseenter event
         * @listens document#event:generic
         * @returns {boolean} Always false to prevent bubbling.
         */
        function onLabHover(event) {
          var id;
          if (event.target.tagName == 'LI') {
            id = $(event.target).data('id');
          } else {
            id = $(event.target).parents('li').data('id');
          }
          this.myLab = this.labs[id];
          this.myLab.marker.setIcon(this.mapMarkerHover);
          this.myLab.marker.setAnimation(google.maps.Animation.BOUNCE);

          return false;
        }


        /**
         * Is called when user hovers on a result and causes the corresponding map pin to change
         *
         * @this    {Findalab} The find a lab instance.
         * @returns {boolean} Always false to prevent bubbling.
         */
        function onPhlebotomistsHover() {
          this.myLab = this.phlebotomists;
          this.myLab.marker.setIcon(this.mapMarkerHover);
          this.myLab.marker.setAnimation(google.maps.Animation.BOUNCE);

          return false;
        }

        /**
         * Is called when user unhovers on a result and causes the corresponding map pin to go back to normal
         *
         * @this    {Findalab}             The find a lab instance.
         * @listens document#event:generic
         * @returns {boolean} Always false to prevent bubbling.
         */
        function onLabMarkerUnhover() {
          this.myLab.marker.setIcon(this.mapMarker);
          this.myLab.marker.setAnimation(null);

          return false;
        }

        /**
         * Is called when user unhovers on a result and causes the corresponding map pin to go back to normal
         *
         * @this    {Findalab}             The find a lab instance.
         * @listens document#event:generic
         * @returns {boolean} Always false to prevent bubbling.
         */
        function onIhcMarkerUnhover() {
          this.myLab.marker.setIcon(this.ihcMapMarker);
          this.myLab.marker.setAnimation(null);

          return false;
        }

      };

      /**
       * Centers the map to the specified coordinates.
       *
       * @param {float} lat   The latitude to center to.
       * @param {float} long  The longitude to center to.
       */
      this.centerMap = function(lat, long) {
        self.settings.googleMaps.map.setCenter(this._buildLatLong(lat, long));
        /**
         * Handles the response from Google's GeoCoding service.
         *
         * @param {{geometry: {location: string}}[]} results
         * @param {string} status
         */
        var handleGeoCodeResponse = function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            self.settings.googleMaps.map.setCenter(results[0].geometry.location);
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
          }
        };
        self.settings.googleMaps.geoCoder.geocode({ address: lat + ',' + long }, handleGeoCodeResponse);
      };

      /**
       * Triggers the Google Maps resize event.
       *
       * Useful for when the map was hidden when it booted.
       */
      this.resize = function() {
        google.maps.event.trigger(self.settings.googleMaps.map, 'resize');
      };

      /**
       * disables all form elements inside the findalab component
       */
      this.showDisabledState = function () {
        this.find(':input').prop('disabled', true);
      };

      /**
       * resets all form elements inside the findalab component to enabled
       */
      this.removeDisabledState = function() {
        this.find(':input').prop('disabled', false);
      };

      /**
       * Event handler for when a zip / postal code is submitted for search.
       *
       * Can be overridden with custom behavior for the particular page that the
       * map is embedded into. The method should return false if the search should
       * be cancelled (input validation etc)
       *
       * @param  {string}  zip The zip or postal code that was entered into the search field.
       * @throws {string}  error message if the search cannot be performed for some reason.
       */
      this.onSearchSubmit = function(zip) {
        // override me!
      };

      /**
       * Event handler for when a search is successful.
       *
       * Can be overridden with custom behavior for the particular page that the
       * map is embedded into.
       *
       * @param {LabResult[]} labs
       * @param {PhlebotomistResult[]} phlebotomists
       */
      this.onSearchSuccess = function(labs, phlebotomists) {
        // override me!
      };

      /**
       * Event handler for when a search fails.
       *
       * Can be overridden with custom behavior for the particular page that the
       * map is embedded into.
       *
       * @param {string} message The error message.
       */
      this.onSearchError = function(message) {
        // override me!
      };

      /**
       * Event handler for when a user selects a lab.
       *
       * Should be overridden to implement the appropriate behavior
       * on the page this component is used on.
       *
       * @param {Lab} lab
       */
      this.onLabSelect = function(lab) {
        // override me!
      };

      /**
       * Empties the search field input.
       */
      this.resetSearchField = function() {
        this.find('[data-findalab-search-field]').val('');
      };

      /**
       * Replaces the results and total count with no results.
       */
      this.resetResults = function() {
        this.find('.findalab__results li').remove();
        this.find('[data-findalab-total]').html('No Results');
        self._setMessage(self.emptyResultsMessage);
      };

      /**
       * Clears out all of the markers on the map.
       */
      this.resetMapMarkers = function() {
        var markersLength = self.settings.googleMaps.markers.length;
        for (var i = 0; i < markersLength; i++) {
          self.settings.googleMaps.markers[i].setMap(null);
        }
        self.settings.googleMaps.markers = [];
      };

      /**
       * Centers and resets the zoom of the map back to default position.
       */
      this.resetMapView = function() {
        self.settings.googleMaps.map.setCenter(this._buildLatLong(
          self.settings.googleMaps.defaultLat, self.settings.googleMaps.defaultLong
        ));
        self.settings.googleMaps.map.setZoom(self.settings.googleMaps.initialZoom);
        self.settings.googleMaps.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      };

      /**
       * Resets the map's zoom and position, and clears the markers.
       */
      this.resetMap = function() {
        self.resetMapMarkers();
        self.resetMapView();
      };

      /**
       * Resets the lab finder to its default state.
       */
      this.reset = function() {
        self.resetSearchField();
        self.resetResults();
        self.resetMap();
      };

      /**
       * This function will retrieve latitude and longitudes and also collection centers
       * near these coordinates.
       *
       * @param {string} searchValue
       */
      this.search = function(searchValue) {
        this.find('[data-findalab-search-field]').val(searchValue);

        try {
          this.onSearchSubmit(searchValue);
        } catch(message) {
          self._setMessage(message);
          return;
        }
        var searchValueCountry = self.getPostalCodeCountry(searchValue);
        if (searchValueCountry === null) {
          self._setMessage(self.invalidPostalCodeMessage);
          return;
        }
        self._searchGeoCode(searchValue, searchValueCountry);
      };

      /**
       * Builds a Google Maps Latitude/Longitude object.
       *
       * @param   {float|string|number} lat  Optional latitude parameter.
       * @param   {float|string|number} long Optional longitude parameter.
       * @return  {LatLng}
       * @private
       */
      this._buildLatLong = function(lat, long) {
        lat = lat !== undefined ? lat : self.settings.googleMaps.defaultLat;
        long = long !== undefined ? long : self.settings.googleMaps.defaultLong;

        return new google.maps.LatLng(lat, long);
      };

      /**
       * Construct Google Maps
       *
       * @param  {GoogleMapsSetting} googleMapsObject Google Maps settings
       * @private
       */
      this._constructGoogleMaps = function(googleMapsObject) {
        if (typeof google === 'undefined') {
          alert('Hey! The Google Maps script is missing or not properly called, please check ' +
          'the Medology Find A Labs component documentation to make sure everything is ' +
          'setup correctly.');
        }

        var mapOptions = {
          center: this._buildLatLong(googleMapsObject.defaultLat, googleMapsObject.defaultLong),
          zoom: googleMapsObject.initialZoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        googleMapsObject.map = new google.maps.Map(document.getElementById('findalab-map'), mapOptions);
        googleMapsObject.geoCoder = new google.maps.Geocoder();
        googleMapsObject.infoWindow = new google.maps.InfoWindow();

        var resetZoom = function() {
            if (googleMapsObject.map.getZoom() > 15) {
                // Change max/min zoom here
                googleMapsObject.map.setZoom(15);
            }
        };
        google.maps.event.addListener(googleMapsObject.map, 'zoom_changed', resetZoom);
        google.maps.event.addListener(googleMapsObject.map, 'bounds_changed', resetZoom);
      };

      /**
       * Construct the in home collection component.
       *
       * @param {InHomeCollectionSetting} inHomeCollectionObject In-home collection settings
       * @private
       */
      this._constructInHomeCollection = function(inHomeCollectionObject) {
        this.find('[data-findalab-ihc-title]').html(inHomeCollectionObject.title);
        this.find('[data-findalab-ihc-description]').html(inHomeCollectionObject.description);
        this.find('[data-findalab-ihc-time-title]').html(inHomeCollectionObject.timeTitle);
        this.find('[data-findalab-ihc-time-details]').html(inHomeCollectionObject.timeDetails);
        this.find('[data-findalab-ihc-button]').html(inHomeCollectionObject.button);
        this.find('[data-findalab-ihc-button]').addClass(inHomeCollectionObject.buttonClass);
        this.find('[data-findalab-ihc-notice]').html(inHomeCollectionObject.notice);
      };

      /**
       * Construct the use current location option.
       *
       * @param  {UserLocationSetting} userLocationObject user location settings
       * @private
       */
      var _constructUserLocation = function(userLocationObject) {
        self.find('[data-findalab-user-location]').html('<i aria-hidden="true"></i> ' + userLocationObject.msg);
        self.find('[data-findalab-user-location] i').addClass(userLocationObject.icon);
        self.on('click', '[data-findalab-user-location]', _onFindLocationSubmit);
      };

      /**
       * Construct the day of week filter option.
       *
       * @param {DayOfWeekFilterSetting} dayOfWeekObject
       * @private
       */
      this._constructDayOfWeekFilter = function (dayOfWeekObject) {
        var container = this.find('[data-findalab-day-filter]');
        container.append('<label><input type="radio" name="day-of-week-filter" value="" checked>'
          + dayOfWeekObject.radioAllText + '</label>');
        for (var day in dayOfWeekObject.radioDaysText) {
          if (dayOfWeekObject.radioDaysText.hasOwnProperty(day)) {
          container.append('<label><input type="radio" name="day-of-week-filter" value="' + day + '">'
            + dayOfWeekObject.radioDaysText[day] + '</label>');
          }
        }
        this.find('[data-findalab-day-filter]').on('change', this._onDayOfWeekFilterChanged);
      };

      /**
       * Construct search button, fields and text.
       *
       * @param  {SearchSetting}     searchObject     Search settings
       * @param  {InputGroupSetting} inputGroupObject Input group settings
       * @private
       */
      this._constructSearch = function(searchObject, inputGroupObject) {
        this.find('[data-findalab-search-button]').addClass(searchObject.buttonClass).html(
          searchObject.buttonText
        );
        this._setPlaceholder(searchObject.placeholder);
        this._setInputType(searchObject.inputType);
        this.find('[data-findalab-search-button]').on('click', $.proxy(this._onSearchSubmit, this));
        this.find('[data-findalab-inputgroup-container]').addClass(inputGroupObject.container);
        this.find('[data-findalab-inputgroup-field]').addClass(inputGroupObject.field);
        this.find('[data-findalab-inputgroup-button]').addClass(inputGroupObject.button);
        this.find('[data-findalab-search-title]').html(searchObject.title);
        this.find('[data-findalab-search-desc]').html(self.searchDesc);
      };

      /**
       * Tab navigation on smaller screens.
       *
       * @private
       */
      this._contentNav = function() {
        $('[data-findalab-nav-item]').on('click', function() {
          var content = $(this).data('findalab-nav-item');
          $('[data-findalab-nav-item]').removeClass('is-active');
          $(this).addClass('is-active');
          self.find('[data-findalab-content]').removeClass('is-active');
          self.find('[data-findalab-content="' + content + '"]').addClass('is-active');
          self.resize();
          self.settings.googleMaps.map.fitBounds(self.bounds);
        });
      };

      this.fadeIntoView = function() {
        $(this).fadeIn(500);
      };

      /**
       * Returns the country code for the specified zip code.
       *
       * Currently only supports Canada, United States and Puerto Rico.
       *
       * @param   {string} postalCode The zipCode to get the country code for.
       * @returns {string|null} The two character country code. Either CA, PR or US.
       */
      this.getPostalCodeCountry = function(postalCode) {
        var caRegex = new RegExp(
          /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i
        );

        if (caRegex.test(postalCode)) {
          return 'CA';
        }

        // Check for Puerto Rico zips
        var intZip = parseInt(postalCode);
        if ((intZip >= 600 && intZip <= 799) || (intZip >= 900 && intZip <= 999)) {
          return 'PR';
        }

        if (isNaN(intZip)) {
          return null;
        }

        return 'US';
      };

      /**
       * Initializes the "Show Hours" link for Labs.
       *
       * @private
       */
      this._initShowStructuredHours = function() {
        /**
         * Hide/Show Hours
         * @see https://css-tricks.com/snippets/jquery/toggle-text/
         */
        $('[data-findalab-toggle-hours]').on('click', function(event) {
          event.preventDefault();
          var $link = $(this);
          var $toggle = $link.siblings('.findalab__hours');
          $link.text($toggle.is(':visible') ? 'Show ▼' : 'Hide ▲');
          $toggle.slideToggle('300');
        });
      };

      /**
       * Private event handler for when the user selects a lab.
       *
       * @param {Lab} lab
       * @private
       */
      this._onLabSelect = function(lab) {
        this.onLabSelect(lab);
      };

      /**
       * Search the collection centers.
       *
       * @param {object} geocode   The geocode to search near
       * @param {string} [country] The country value
       * @private
       */
      this._searchCollectionCenters = function(geocode, country) {
        var labsPromise = self._searchNearCoords(
          self.settings.searchURL.labs, country, geocode
        );

        var phlebotomistsPromise = self._searchNearCoords(
          self.settings.searchURL.phlebotomists, country, geocode
        );

        $.when(labsPromise, phlebotomistsPromise, geocode).
          done(self._onSearchSuccess).
          fail(self._onSearchError).
          always($.proxy(self._onSearchComplete, self));
      };

      /**
       * Search the geocode location
       *
       * @param  {string} searchValue        The value searched
       * @param  {string} searchValueCountry The country of the searched value
       * @private
       */
      this._searchGeoCode = function(searchValue, searchValueCountry) {
        $.ajax({
          url: self.settings.baseURL + '/geocode',
          dataType: 'json',
          data: { zip: searchValue, countryCode: searchValueCountry }
        }).done(
            function(results) {
            if (!results.length) {
                self._setMessage(self.noResultsMessage);
            }

            self._searchCollectionCenters(results[0])
        }).fail(self._onSearchError);
      };

      /**
       * Finds nearby collection centers from the country and geocode given.
       *
       * @param  {string} collectionCenter    The type of collection center
       * @param  {string} country             The country of the search
       * @param  {object} geocode             The geocode to search near
       * @param  {float}  geocode.latitude    The latitude of the geocode
       * @param  {float}  geocode.longitude   The longitude of the geocode
       * @param  {string} geocode.countryCode The country code of the geocode
       * @return {ajax}   The collection center results from the ajax request
       * @private
       */
      this._searchNearCoords = function(collectionCenter, country, geocode) {
        return $.ajax({
          url: self.settings.baseURL + '/' + collectionCenter + '/nearCoords',
          dataType: 'json',
          data: $.extend({
            countryCode: country,
            filterNetwork: self.settings.searchFunction.excludeNetworks,
            labCount: self.settings.searchFunction.limit,
            network: self.settings.searchFunction.onlyNetwork,
            dayOnly: self.settings.dayOfWeekFilter.showOption ? self.settings.dayOfWeekFilter.dayOnly : ''
          }, geocode)
        });
      };

      /**
      * Sets the type value of the search input.
      *
      * @param {string} theType the type of input
      * @private
      */
      this._setInputType = function(theType) {
        this.find('[data-findalab-search-field]').attr('type', theType);
      };

      /**
      * Sets the text to display on the lab select buttons.
      *
      * @param {string} text
      * @private
      */
      this._setLabSelectText = function(text) {
        this.find('[data-findalab-result-button]').html(text);
        self.settings.lab.buttonText = text;
      };

      /**
       * Displays the specified message to the user.
       *
       * @param {string} message This is the message that will be shown.
       * @private
       */
      this._setMessage = function(message) {
        $('[data-findalab-result-list]').empty();
        var $message = this.find('[data-findalab-message][data-template]').clone().removeAttr('data-template');
        $message.html(message).appendTo('[data-findalab-result-list]');
        self._onSearchComplete();
      };

      /**
       * Sets the placeholder text for the search input.
       *
       * @param {string} message the placeholder message
       * @private
       */
      this._setPlaceholder = function(message) {
        this.find('[data-findalab-search-field]').attr('placeholder', message);
      };

      /**
       * Show markers function
       *
       * @param {Lab} lab
       * @private
       */
      this._showMarker = function(lab) {
        var location = this._buildLatLong(lab.center_latitude, lab.center_longitude);
        var vMarker;

        vMarker = new google.maps.Marker({
          map: self.settings.googleMaps.map,
          icon: this.mapMarker,
          position: location
        });

        self.settings.googleMaps.markers.push(vMarker);

        this.bounds.extend(location);

        var infoWindowContent =
              '<h6>' + lab.lab_title + '</h6>' +
              '<p>' +
              lab.center_address + '<br>' +
              lab.center_city + ', ' + lab.center_state + ' ' + lab.center_zip +
              '</p>';

        if (self.settings.lab.hasButton) {
          infoWindowContent +=
            '<a ' +
            'data-findalab-result-button ' +
            'class="' + self.settings.lab.buttonClass + '" ' +
            'href="#" ' +
            'data-id="' + lab.center_id + '" ' +
            'data-address="' + lab.center_address + '" ' +
            'data-city="' + lab.center_city + '" ' +
            'data-state="' + lab.center_state + '" ' +
            'data-zipcode="' + lab.center_zip + '" ' +
            'data-network="' + lab.network + '" ' +
            'data-title="' + lab.lab_title + '" ' +
            'data-country="' + lab.center_country + '" ' +
            'data-fax_number="' + lab.fax_number + '"' +
            '>' +
            self.settings.lab.buttonText +
            '</a>';
        }

        google.maps.event.addListener(vMarker, 'click', $.proxy(function() {
          self.settings.googleMaps.infoWindow.setContent(infoWindowContent);

          // noinspection JSUnresolvedFunction
          self.settings.googleMaps.infoWindow.open(self.settings.googleMaps.map, vMarker);
        }, this));

        lab.marker = vMarker;
      };


      /**
       * Shows the in-home collection marker on the Google Map
       *
       * @param {Geocode} geocode
       * @private
       */
      this._showIhcMarker = function(geocode) {
        var location = this._buildLatLong(geocode.latitude, geocode.longitude);
        var vMarker;

        vMarker = new google.maps.Marker({
          map: self.settings.googleMaps.map,
          icon: this.ihcMapMarker,
          position: location
        });

        self.settings.googleMaps.markers.push(vMarker);

        this.bounds.extend(location);

        var infoWindowContent =
          '<h6>' + self.settings.inHomeCollection.title + '</h6>' +
          '<p style="max-width: 200px">' + self.settings.inHomeCollection.description + '</p>';

        if (self.settings.lab.hasButton) {
          infoWindowContent +=
            '<button type="button" data-findalab-ihc-button class="' +
            self.settings.inHomeCollection.buttonClass +
            '">' +
            self.settings.inHomeCollection.button +
            '</button>'
        }

        google.maps.event.addListener(vMarker, 'click', $.proxy(function() {
          self.settings.googleMaps.infoWindow.setContent(infoWindowContent);

          // noinspection JSUnresolvedFunction
          self.settings.googleMaps.infoWindow.open(self.settings.googleMaps.map, vMarker);
        }, this));

        geocode.marker = vMarker;
        this.phlebotomists = geocode;

      };


      /**
       * This function will handle rendering labs.
       * @param {Lab[]} labs
       * @return {boolean} Whether any labs were rendered.
       * @private
       */
      this._renderLabs = function(labs) {
        var $resultsList = this.find('[data-findalab-result-list]');
        var $resultTemplate = this.find('[data-findalab-result][data-template]');

        $resultsList.empty();

        /**
         * @param {int} index
         * @param {Lab} lab
         */
        $.each(labs, $.proxy(function(index, lab) {
          var $result = $resultTemplate.clone().removeAttr('data-template');
          $result.data('id', index);
          if (lab.lab_title) {
            $result.find('[data-findalab-result-title]').html(lab.lab_title);
          } else {
            $result.find('[data-findalab-result-title]').remove();
          }

          $result.find('[data-findalab-result-address]').html(
            lab.center_address + '<br>' +
            lab.center_city + ', ' + lab.center_state + ' ' + lab.center_zip
          );
          $result.find('[data-findalab-result-distance]').html(
            '<strong>Distance:</strong> ' + this._parseDistance(lab)
          );

          if (self.settings.lab.hasButton) {
            $result.find('[data-findalab-result-button]')
              .attr('data-id', lab.center_id)
              .attr('data-address', lab.center_address)
              .attr('data-city', lab.center_city)
              .attr('data-state', lab.center_state)
              .attr('data-zipcode', lab.center_zip)
              .attr('data-network', lab.network)
              .attr('data-title', lab.lab_title)
              .attr('data-fax_number', lab.fax_number)
              .addClass(self.settings.lab.buttonClass)
              .html(self.settings.lab.buttonText);
          } else {
            $result.find('[data-findalab-result-button]').remove();
            $result.find('[data-findalab-break]').remove();
          }

          if (!lab.structured_hours) {
            $result.find('[data-findalab-result-structured-hours]').remove();
            $result.find('[data-findalab-result-simple-hours]').html(
              '<strong>Hours:</strong> ' + lab.center_hours
            );
          } else {
            $result.find('[data-findalab-result-simple-hours]').remove();
            this._buildHoursDom(lab, $result);
            $result.find('[data-findalab-structured-hours-row][data-template]').remove();
          }

          $result.appendTo($resultsList);

        }, this));

        this._initShowStructuredHours();

        labs.map($.proxy(this._showMarker, this));

        if (labs[0]) {
          self.labs = labs;
          return true;
        }

        return false;
      };

      /**
       * Renders the phlebotomists component
       *
       * @param  {PhlebotomistResult} phlebotomists Response from api
       * @param  {Geocode}            geocode
       * @return {boolean} whether the in-home collections modal was rendered.
       * @private
       */
      this._renderPhlebotomists = function(phlebotomists, geocode) {
        var $resultsList = this.find('[data-findalab-result-list]');
        var $inHomeCollection = this.find('[data-findalab-ihc][data-template]').clone().removeAttr('data-template');
        if (self.settings.inHomeCollection.showComponent && phlebotomists.hasPhlebotomists) {
          $inHomeCollection.prependTo($resultsList);
          self._showIhcMarker(geocode);
        }
        return phlebotomists.hasPhlebotomists;
      };

      /**
       * Counts, adds together and displays the results and phlebotomist combined total.
       *
       * @param {LabResult[]}          resultsLabs
       * @param {PhlebotomistResult[]} resultsPhlebotomists
       * @private
       */
      this._renderResultsTotal = function(resultsLabs, resultsPhlebotomists) {
        var totalResults = resultsLabs[0].labs.length;
        totalResults += resultsPhlebotomists[0].hasPhlebotomists === true ? 1 : 0;
        var pluralLabs = totalResults > 1 ? 's' : '';
        self.find('[data-findalab-total]').html(totalResults + ' Result' + pluralLabs);
      };

      /**
       * Parse the distance of lab based on the country where the lab located
       *
       * @param   {Lab} labData
       * @returns {string} The parsed string describe the distance information.
       * @private
       */
      this._parseDistance = function (labData) {
        var parsedDistance = '';
        switch (labData.center_country) {
          case 'CA' :
            parsedDistance = (labData.center_distance / 0.62137).toFixed(2) + 'km.';
            break;
          case 'US' :
          default:
            parsedDistance = labData.center_distance.toFixed(2) + 'mi.';
            break;
        }
        return parsedDistance;
      };

      /**
       * Builds the structured hours DOM for a Lab entry.
       *
       * @param {Lab} lab
       * @param {jQuery} $result The jQuery DOM that should be modified to show the hours.
       * @private
       */
      this._buildHoursDom = function(lab, $result) {
        var $table = $result.find('[data-findalab-structured-hours-body]');

        $.each(lab.structured_hours, function(/**string*/ day, /**Day*/ hours) {
          var $row = $result.find('[data-findalab-structured-hours-row][data-template]')
                      .clone()
                      .removeAttr('data-template');
          $row.find('[data-findalab-result-day]').html(day);
          $row.find('[data-findalab-result-hours]').html(hours.open + ' - ' + hours.close);

          if (hours.lunch_start) {
            $row.find('[data-findalab-result-hours-lunch]').html(hours.lunch_start + ' - ' + hours.lunch_stop);
          } else {
            $row.find('[data-findalab-result-day-lunch]').remove();
            $row.find('[data-findalab-result-hours-lunch]').remove();
          }

          $table.append($row);
        });
      };

      /**
       * Private event handler for a search is initiated.
       *
       * @param {document#event:generic} event
       * @listens document#event:generic
       * @private
       */
      this._onSearchSubmit = function(event) {
        event.preventDefault();
        self.resetResults();
        self.resetMapMarkers();
        $('[data-findalab-search-button]').html(this.settings.search.buttonLoadingText);
        $('[data-findalab-result-list]').scrollTop(0);
        var searchValue = this.find('[data-findalab-search-field]').val();
        if (!searchValue.length) {
          self._setMessage('Please do not leave the search field blank. Enter a value and try searching again.');
        } else {
          this.search(searchValue);
        }
      };

       /**
       * Private event handler for a finding user location.
       *
       * @param {document#event:generic} event
       * @listens document#event:generic
       * @private
       */
      var _onFindLocationSubmit = function(event) {

        event.preventDefault();

        $('[data-findalab-user-location]').html(self.settings.userLocation.buttonLoadingText);

        if(!navigator.geolocation) {
          _displayGeolocateError();
        } else {
          navigator.geolocation.getCurrentPosition(_searchByCoords);
        }

        /**
         * Searches for labs near the specified latitude and longitude.
         *
         * Determines the zip code nearest to the provided latitude and
         * longitude, and searches for Labs near that zip code.
         *
         * @param  {Geocode} geo                  the geolocation object
         * @param  {string} geo.coords.latitude  the latitude of the geolocation
         * @param  {string} geo.coords.longitude the longitude of the geolocation
         */
        function _searchByCoords(geo) {

          var lat = geo.coords.latitude;
          var long = geo.coords.longitude;

          $.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long)
            .success(_geolocateSuccess)
            .fail(_displayGeolocateError);
        }

        /**
         * called on ajax success, submits zipcode into input field
         * @param  {{results[]}} data ajax results from google api
         */
        function _geolocateSuccess(data) {

          var addresses = data.results.filter(_hasPostalCode);
          var address = addresses[0];
          var zip = _getPostalCode(address);

          if (zip) {
            $('[data-findalab-search-field]').val(zip);
            $('[data-findalab-search-button]').click();
          }
        }

        /**
         * Determines if an address has a postal code address component.
         * @param  {array}  addresses the array of addresses
         * @return {boolean} returns true if it has a postal code
         */
        function _hasPostalCode(addresses) {
          return _getPostalCode(addresses) !== null;
        }

        /**
         * check if an address component is a postal code
         * @param  {array}  component.types address components
         * @return {boolean} true if the address has a postal code. false if not.
         */
        function _isPostalCode(component) {
          return component.types.indexOf('postal_code') !== -1;
        }

        /**
         * Gets the postal code of an address.
         *
         * @param {{address_components: {long_name: string}[]}} addresses the address to analyze.
         * @return {string|null} the postal code, or null if the address does not have a postal code.
         */
        function _getPostalCode (addresses) {
          if (!Array.isArray(addresses.address_components)) {
            return null;
          }

          // get the first address_component that is a postal code
          var postalCodeComponents = addresses.address_components.filter(_isPostalCode);
          if (!postalCodeComponents.length) {
            return null;
          }

          var postalCodeComponent = postalCodeComponents[0];

          return postalCodeComponent.long_name;
        }

        /**
         * sets the text of the error message that is displayed to the user
         */
        function _displayGeolocateError() {
          self._setMessage(self.cannotGeolocateMessage);
        }

      };

      /**
       * Private event handler for when a search is successful.
       *
       * @param {LabResult[]}          resultsLabs
       * @param {PhlebotomistResult[]} resultsPhlebotomists
       * @param {Geocode}              geocode
       * @private
       */
      this._onSearchSuccess = function(resultsLabs, resultsPhlebotomists, geocode) {
          self.bounds = new google.maps.LatLngBounds();
          var noLabs = !self._renderLabs(resultsLabs[0].labs);
          var noPhlebotomists = !self._renderPhlebotomists(resultsPhlebotomists[0], geocode);
          if (noLabs && noPhlebotomists) {
              self._setMessage(self.noResultsMessage);
          }
          self.settings.googleMaps.map.fitBounds(self.bounds);
          self._renderResultsTotal(resultsLabs, resultsPhlebotomists);
          self.onSearchSuccess(resultsLabs, resultsPhlebotomists);
      };

      /**
       * Private event handler for when a search fails. (jqXhr version)
       *
       * @param {{responseText:string}} jqXhr
       * @private
       */
      this._onSearchError = function(jqXhr) {
        self._onSearchErrorString(jqXhr.responseText);
      };

      /**
       * Private event handler for when a search fails. (string version)
       *
       * @param {string} message
       * @private
       */
      this._onSearchErrorString = function(message) {
        this.find('[data-findalab-result-list]').html(
          '<li class="findalab__result">There are no search results.</li>'
        );

        self._setMessage(self.noResultsMessage);
        self.onSearchError(JSON.parse(message).message);
      };

      /**
       * This function will handle clean up after searches regardless of server response.
       * @private
       */
      this._onSearchComplete = function() {
        this.find('[data-findalab-search-button]').html(this.settings.search.buttonText);
      };

      /**
       * The event handler for day filter radio button is changed.
       *
       * @param {document#event:generic} event
       * @listens document#event:generic
       * @private
       */
      this._onDayOfWeekFilterChanged = function(event) {
        self.settings.dayOfWeekFilter.dayOnly = $(event.target).val();
        var searchValue = self.find('[data-findalab-search-field]').val();
        if (searchValue.length) {
            self.find('[data-findalab-search-button]').click();
        }
      };

      this.construct(self.settings);

      return this;
    }
  });
})(jQuery);

/**********************         Events          *****************************/
/**
 * Define generic dom event
 *
 * @event document#generic
 * @type {object}
 * @property {int} keyCode
 * @property {Object} target
 * @property {function} preventDefault
 */

/**********************    Ajax Response Type    *****************************/
/**
 * Define the Day type for the Days object
 *
 * @typedef {Object} Day
 * @property {string} open
 * @property {string} close
 * @property {string} [lunch_start]
 * @property {string} [lunch_stop]
 */

/**
 * Define the Days type for Lab object
 * @typedef {Object} Days
 * @property {Day} Monday
 * @property {Day} Tuesday
 * @property {Day} Wednesday
 * @property {Day} Thursday
 * @property {Day} Friday
 * @property {Day} [Saturday]
 */

/**
 * Define the lab type
 *
 * @typedef {Object} Lab
 * @property {string} address
 * @property {string} center_address
 * @property {string} center_city
 * @property {string} center_country
 * @property {float}  center_distance
 * @property {string} center_hours
 * @property {string} center_id
 * @property {string} center_latitude
 * @property {string} center_longitude
 * @property {string} center_network
 * @property {string} center_state
 * @property {string} center_zip
 * @property {string} city
 * @property {string} country
 * @property {string} deleted_at
 * @property {string} distance
 * @property {string} fax_number
 * @property {string} geocode_address
 * @property {string} hours
 * @property {string} import_hash
 * @property {string} imported_hours
 * @property {string} is_northeast
 * @property {string} lab_title
 * @property {string} latitude
 * @property {string} longitude
 * @property {google.maps.Marker} marker
 * @property {string} max_distance
 * @property {string} network
 * @property {string} number
 * @property {string} phoneNumber
 * @property {string} state
 * @property {Days}   structured_hours
 * @property {string} type
 * @property {string} zipcode
 */

/**
 * Define the phlebotomist result type
 * @typedef {Object} PhlebotomistResult
 * @property {boolean} hasPhlebotomists
 * @property {string}  latitude
 * @property {string}  longitude
 */

/**
 * Define the Lab result type
 * @typedef {Object} LabResult
 * @property {Lab[]}  labs
 * @property {string} latitude
 * @property {string} longitude
 * @property {int}    resultCount
 */

/**
 * Define the GeoCode result type.
 * @typedef {Object} Geocode
 * @property {string}             countryCode
 * @property {float}              latitude
 * @property {float}              longitude
 * @property {google.maps.Marker} marker
 */

/**********************  External: Google Map API   ***************************/

/**
 * Define the Google Map API external resource
 * @external GoogleMapApi
 * @see {@link https://developers.google.com/maps/documentation/javascript/reference}
 */

/******************************************
 * @class google
 * @property {Object} maps
 * @memberOf GoogleMapApi
 *****************************************/

/******************************************
 * @function maps
 * @property {{BOUNCE:1, Co:4, DROP:2, Eo:3}} Animation
 * @property {{ERROR: 'ERROR', OK: 'OK'}} GeocoderStatus
 * @function {Object} LatLngBounds
 * @property {{ROADMAP: 'roadmap'}} MapTypeId
 * @memberOf google
 *****************************************/

/******************************************
 * @function Marker
 * @memberOf google.maps
 * @see {@link https://developers.google.com/maps/documentation/javascript/reference#Marker}
 */

/**
 * @function setIcon
 * @memberOf google.maps.Marker
 */

/**
 * @function setMap
 * @memberOf google.maps.Marker
 */

/**
 * @function setAnimation
 * @memberOf google.maps.Marker
 ******************************************/

/******************************************
 * @function Map
 * @memberOf google.maps
 * @see {@link https://developers.google.com/maps/documentation/javascript/reference#Map}
 */

/**
 * @function fitBounds
 * @memberOf google.maps.Map
 */

/**
 * @function getZoom
 * @memberOf google.maps.Map
 * /

/**
 * @function setCenter
 * @memberOf google.maps.Map
 */

/**
 * @function setMapTypeId
 * @memberOf google.maps.Map
 */

/**
 * @function setZoom
 * @memberOf google.maps.Map
 ******************************************/

/******************************************
 * @function Geocoder
 * @memberOf google.maps
 * @see {@link https://developers.google.com/maps/documentation/javascript/reference#Geocoder}
 */

/**
 * @function geocode
 * @memberOf google.maps.Geocoder
 ******************************************/

/******************************************
 * @function LatLng
 * @memberOf google.maps
 * @see {@link https://developers.google.com/maps/documentation/javascript/reference#LatLng}
 ******************************************/

/******************************************
 * @function LatLngBounds
 * @memberOf google.maps
 * @see {@link https://developers.google.com/maps/documentation/javascript/reference#LatLngBounds}
 ******************************************/

/******************************************
 * @function InfoWindow
 * @memberOf google.maps
 * @see {@link https://developers.google.com/maps/documentation/javascript/reference#InfoWindow}
 ******************************************/
