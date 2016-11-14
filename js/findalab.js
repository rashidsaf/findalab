/*global google*/
(function($) {

  $.fn.extend({

    /**
     * Controller for Lab Search component.
     *
     * @param  {{lat:float, long:float}} settings
     * @var {object} find
     * @returns {labSearch}
     */
    findalab: function(settings) {
      var self = this;

      this.settings = {
        baseURL: 'http://findalab.local/',
        searchURL: {
          labs: 'labs',
          phlebotomists: 'phlebotomists'
        },
        googleMaps: {
          defaultLat: 39.97712, // TODO: Address Canada's default lat
          defaultLong: -99.587403, // TODO: Address Canada's default long
          geoCoder: null,
          infoWindow: null,
          initialZoom: 4, // The zoom level for when no search has been performed yet (pretty far out)
          map: null,
          markers: [],
          resultsZoom: 10, // The zoom level for when there are search results
          mapMarkerFillColor: '#3398db',
          mapMarkerHoverFillColor: '#eb4d4c'
        },
        searchFunction: {
          excludeNetworks: undefined,
          limit: undefined,
          onlyNetwork: undefined
        },
        lab: {
          hasButton: true,
          buttonClass: null,
          buttonText: 'Choose This Location'
        },
        inputGroup: {
          container: 'input-group',
          field: 'input-group-field',
          button: 'input-group-button'
        },
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
        inHomeCollection: {
          showComponent: true,
          title: 'In-Home Collection',
          description: 'Get the lab to come to you. Schedule an in-home appointment with a Lab Collection Specialist',
          timeTitle: 'Avaliable:',
          timeDetails: '7:00am - 8:00pm, 7 days a week',
          button: 'Select &amp; Continue',
          notice: 'You will schedule your appointment during checkout.'
        },
        emptyResultsMessage: '',
        noResultsMessage: '',
        invalidPostalCodeMessage: ''
      };

      this.settings = $.extend(true, this.settings, settings);

      this.emptyResultsMessage = 'Please "' + this.settings.search.placeholder + '" above and press "' +
      this.settings.search.buttonText + '" to see results.';

      this.noResultsMessage = 'Oops! Sorry, we could not find any testing centers near that location. ' +
      'Please try your search again with a different or less specific address.';

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
          fillColor: self.settings.googleMaps.mapMarkerFillColor,
          fillOpacity: 1,
          scale: 1,
          strokeColor: 'white',
          strokeWeight: 2
        };

      this.mapMarkerHover = $.extend(true, {}, this.mapMarker);

      this.mapMarkerHover.fillColor = self.settings.googleMaps.mapMarkerHoverFillColor;

      this.labs = [];

      this.myLab;

      /**
       * Initializes the map and sets the default viewport lat / long.
       *
       * @var {object} google
       * @param {{lat:float, long:float}} settings
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

        this.fadeIntoView();

        // Capture lab selection events
        this.on('click', '[data-findalab-result-button]', $.proxy(onLabSelectClick, this));
        this.on('mouseenter','[data-findalab-result]', $.proxy(onLabHover, this));
        this.on('mouseleave','[data-findalab-result]', $.proxy(onLabUnhover, this));

        /**
         * Prevents submission of the form on key down.
         *
         * @param {event} event The key down event.
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
         * @this    {Object}        The find a lab instance.
         * @param   {int}     event The key up event.
         * @returns {boolean}       Always false to prevent bubbling.
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
         * @this {Object} The find a lab instance.
         * @param {event} event The click event.
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
         * @param  {event} event the mouseenter event
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
         * Is called when user unhovers on a result and causes the corresponding map pin to go back to normal
         *
         * @param  {event} event the mouseleave event
         * @returns {boolean} Always false to prevent bubbling.
         */
        function onLabUnhover(event) {

          this.myLab.marker.setIcon(this.mapMarker);

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
         * @param {[{geometry:{}}]} results
         * @param {int} status
         */
        var handleGeoCodeResponse = function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            self.settings.googleMaps.map.setCenter(results[0].geometry.location);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
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
       * @param {[]}    labs  The labs that were returned from the server.
       * @param {float} lat   The latitude used for the search.
       * @param {float} long  The longitude used for the search.
       */
      this.onSearchSuccess = function(labs, lat, long) {
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
       * @param {{
       *   id:int,
       *   lab_title:string,
       *   network:string,
       *   address:string,
       *   city:string,
       *   state:string,
       *   zip:int,
       *   fax_number:string,
       * }} lab
       */
      this.onLabSelect = function(lab) {
        // override me!
      };

      /**
       * Resets the lab finder to its default state.
       */
      this.reset = function() {
        this.find('.findalab__results li').remove();
        this.find('[data-findalab-search-field]').val('');
        this.find('[data-findalab-total]').html('No Results');
        self._setMessage(self.emptyResultsMessage);

        self.settings.googleMaps.map.setCenter(this._buildLatLong(
          self.settings.googleMaps.defaultLat, self.settings.googleMaps.defaultLong
        ));
        self.settings.googleMaps.map.setZoom(self.settings.googleMaps.initialZoom);
        self.settings.googleMaps.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

        var markersLength = self.settings.googleMaps.markers.length;
        for (var i = 0; i < markersLength; i++) {
          self.settings.googleMaps.markers[i].setMap(null);
        }

        self.settings.googleMaps.markers = [];
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
       * @param   {float} lat  Optional latitude parameter.
       * @param   {float} long Optional longitude parameter.
       * @return  {{}}
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
       * @param  {object} googleMapsObject Google Maps settings
       */
      this._constructGoogleMaps = function(googleMapsObject) {
        if (typeof google === 'undefined') {
          alert('Hey! The Google Maps script is missing or not properly called, please check ' +
          'the Medology Find A Labs component documentation to make sure everything is ' +
          'setup correctly.');
        }

        var mapOptions = {
          center: this._buildLatLong(googleMapsObject.lat, googleMapsObject.long),
          zoom: googleMapsObject.initialZoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        googleMapsObject.map = new google.maps.Map(document.getElementById('findalab-map'), mapOptions);
        googleMapsObject.geoCoder = new google.maps.Geocoder();
        googleMapsObject.infoWindow = new google.maps.InfoWindow();
      };

      /**
       * Construct the in home collection component.
       *
       * @param  {object} inHomeCollectionObject In-home collection settings
       */
      this._constructInHomeCollection = function(inHomeCollectionObject) {
        this.find('[data-findalab-ihc-title]').html(inHomeCollectionObject.title);
        this.find('[data-findalab-ihc-description]').html(inHomeCollectionObject.description);
        this.find('[data-findalab-ihc-time-title]').html(inHomeCollectionObject.timeTitle);
        this.find('[data-findalab-ihc-time-details]').html(inHomeCollectionObject.timeDetails);
        this.find('[data-findalab-ihc-button]').html(inHomeCollectionObject.button);
        this.find('[data-findalab-ihc-notice]').html(inHomeCollectionObject.notice);
      };

      /**
       * Construct search button, fields and text.
       *
       * @param  {object} searchObject     Search settings
       * @param  {object} inputGroupObject Input group settings
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
       */
      this._contentNav = function() {
        $('[data-findalab-nav-item]').on('click', function() {
          var content = $(this).data('findalab-nav-item');
          $('[data-findalab-nav-item]').removeClass('is-active');
          $(this).addClass('is-active');
          self.find('[data-findalab-content]').removeClass('is-active');
          self.find('[data-findalab-content="' + content + '"]').addClass('is-active');
          self.resize();
        });
      };

      this.fadeIntoView = function() {
        $(this).fadeIn(500);
      }

      /**
       * Returns the country code for the specified zip code.
       *
       * Currently only supports Canada, United States and Puerto Rico.
       *
       * @param   {string} postalCode The zipCode to get the country code for.
       * @returns {string} The two character country code. Either CA, PR or US.
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
       * @param {{
       *   id:int,
       *   lab_title:string,
       *   network:string,
       *   address:string,
       *   city:string,
       *   state:string,
       *   zip:int,
       *   fax_number:string,
       * }} lab
       */
      this._onLabSelect = function(lab) {
        this.onLabSelect(lab);
      };

      /**
       * Search the collection centers.
       *
       * @param {[{latitude:float, longitude:float, countryCode:string}]} result
       * @param {string} searchValueCountry The country value
       */
      this._searchCollectionCenters = function(result, searchValueCountry) {
        if (result.length == 0) {
          self._setMessage(self.noResultsMessage);
        }

        var searchLabs = self._searchNearCoords(
          self.settings.searchURL.labs, searchValueCountry, result
        );
        var searchPhlebotomists = self._searchNearCoords(
          self.settings.searchURL.phlebotomists, searchValueCountry, result
        );

        $.when(searchLabs, searchPhlebotomists).done(
            function(resultsLabs, resultsPhlebotomists) {
              if (!self._renderLabs(resultsLabs[0].labs) && !self._renderPhlebotomists(resultsPhlebotomists[0])) {
                self._setMessage(self.noResultsMessage);
              }
            }
          ).fail(self._onSearchError).always($.proxy(self._onSearchComplete, self));
      };

      /**
       * Search the geocode location
       *
       * @param  {string} searchValue        The value searched
       * @param  {string} searchValueCountry The country of the searched value
       */
      this._searchGeoCode = function(searchValue, searchValueCountry) {
        $.ajax({
          url: self.settings.baseURL + '/geocode',
          dataType: 'json',
          data: { zip: searchValue, countryCode: searchValueCountry }
        }).done(self._searchCollectionCenters).fail(self._onSearchError);
      };

      /**
       * Finds nearby collection centers from the country and geocode given.
       *
       * @param  {string} collectionCenter The type of collection center
       * @param  {string} country          The country of the search
       * @param  {object} result           The ajax result of the geocode
       * @return {ajax}                    The collection center results from the ajax request
       */
      this._searchNearCoords = function(collectionCenter, country, result) {
        return $.ajax({
          url: self.settings.baseURL + '/' + collectionCenter + '/nearCoords',
          dataType: 'json',
          data: $.extend({
            countryCode: country,
            filterNetwork: self.settings.searchFunction.excludeNetworks,
            labCount: self.settings.searchFunction.limit,
            network: self.settings.searchFunction.onlyNetwork
          }, result[0])
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
       * @param {{
       *    center_id:int,
       *    center_latitude:float,
       *    center_longitude:float,
       *    center_address:string,
       *    center_city:string,
       *    center_state:string,
       *    center_zip:string,
       *    center_network:string,
       *    center_country:string,
       *    lab_title:string,
       *    network:string,
       *    fax_number:string,
       * }} lab
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
            'data-zip="' + lab.center_zip + '" ' +
            'data-network="' + lab.network + '" ' +
            'data-title="' + lab.lab_title + '" ' +
            'data-country="' + lab.center_country + '"' +
            'data-fax_number="' + lab.fax_number + '"' +
            '>' +
            self.settings.lab.buttonText +
            '</a>';
        };

        google.maps.event.addListener(vMarker, 'click', $.proxy(function() {
          self.settings.googleMaps.infoWindow.setContent(infoWindowContent);

          // noinspection JSUnresolvedFunction
          self.settings.googleMaps.infoWindow.open(self.settings.googleMaps.map, vMarker);
        }, this));

        lab.marker = vMarker;
      };

      /**
       * This function will handle rendering labs.
       * @param {[{
       *   center_id:int,
       *   center_address:string,
       *   center_city:string,
       *   center_state:string,
       *   center_zip:string,
       *   center_hours:string,
       *   center_network:string,
       *   center_distance:float,
       *   lab_title:string,
       *   network:string,
       *   fax_number:string,
       *   structured_hours:object
       * }]} labs
       * @return {boolean} Whether any labs were rendered.
       * @private
       */
      this._renderLabs = function(labs) {
        var $resultsList = this.find('[data-findalab-result-list]');
        var $resultTemplate = this.find('[data-findalab-result][data-template]');
        var pluralLabs = labs.length > 1 ? 's' : '';

        $resultsList.empty();

        this.find('[data-findalab-total]').html(labs.length + ' Result' + pluralLabs);

        /**
         * @param {int} index
         * @param {{
         *   center_id:int,
         *   center_address:string,
         *   center_city:string,
         *   center_state:string,
         *   center_zip:string,
         *   center_hours:string,
         *   center_network:string,
         *   center_distance:float,
         *   lab_title:string,
         *   network:string,
         *   fax_number:string,
         *   structured_hours:object
         * }} lab
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
              .attr('data-zip', lab.center_zip)
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
          this.centerMap(labs[0].center_latitude, labs[0].center_longitude);
          self.settings.googleMaps.map.setZoom(self.settings.googleMaps.resultsZoom);
          self.labs = labs;
          return true;
        }

        return false;
      };

      /**
       * Renders the phlebotomists component
       *
       * @param  {json} phlebotomists Response from api
       * @return {boolean} whether the in-home collections modal was rendered.
       */
      this._renderPhlebotomists = function(phlebotomists) {
        var $resultsList = this.find('[data-findalab-result-list]');
        var $inHomeCollection = this.find('[data-findalab-ihc][data-template]').clone().removeAttr('data-template');

        if (self.settings.inHomeCollection.showComponent && phlebotomists.hasPhlebotomists) {
          $inHomeCollection.prependTo($resultsList);
        }

        return phlebotomists.hasPhlebotomists;
      };

      /**
       * Parse the distance of lab based on the country where the lab located
       *
       * @param   {{center_country:string, center_distance:string}} labData
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
       * @param {{
       *   center_id:int,
       *   center_address:string,
       *   center_city:string,
       *   center_state:string,
       *   center_zip:string,
       *   center_hours:string,
       *   center_network:string,
       *   center_distance:float,
       *   lab_title:string,
       *   network:string,
       *   fax_number:string,
       *   structured_hours:object
       * }} lab
       * @param   {jQuery} $result The jQuery DOM that should be modified to show the hours.
       * @private
       */
      this._buildHoursDom = function(lab, $result) {
        var $table = $result.find('[data-findalab-structured-hours-body]');

        /**
         * @param {{string}} day
         * @param {{open:string, close:string, lunch_start:string, lunch_stop:string}} hours
         */
        $.each(lab.structured_hours, function(day, hours) {
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
       * @param {event} event
       * @private
       */
      this._onSearchSubmit = function(event) {
        event.preventDefault();

        $('[data-findalab-search-button]').html(this.settings.search.buttonLoadingText);

        var searchValue = this.find('[data-findalab-search-field]').val();

        if (!searchValue.length) {
          self._setMessage('Please do not leave the search field blank. Enter a value and try searching again.');
        } else {
          this.search(searchValue);
        }
      };

      /**
       * Private event handler for when a search is successful.
       *
       * @param {{
       *  labs:[{
       *    center_id:int,
       *    center_address:string,
       *    center_city:string,
       *    center_state:string,
       *    center_zip:string,
       *    center_hours:string,
       *    center_network:string,
       *    center_distance:float,
       *    lab_title:string,
       *    network:string,
       *    fax_number:string,
       *    structured_hours:object
       *   }],
       *   latitude:float,
       *   longitude:float
       * }}    response
       * @private
       */
      this._onSearchSuccess = function(response) {
        if (response.labs.length == 0) {
          self._onSearchErrorString(self.noResultsMessage);
        } else {
          self.onSearchSuccess(response.labs, response.latitude, response.longitude);
        }
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
       * This functionwill handle clean up after searches regardless of server response.
       * @private
       */
      this._onSearchComplete = function() {
        this.find('[data-findalab-search-button]').html(this.settings.search.buttonText);
      };

      this.construct(self.settings);

      return this;
    }
  });
})(jQuery);
