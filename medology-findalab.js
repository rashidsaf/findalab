(function($) {
  $.fn.extend({
    /**
     * Controller for Lab Search component.
     *
     * @param   {{lat:float, long:float}} settings
     * @returns {labSearch}
     */
    findalab: function(settings) {
      var self = this;

      // TODO: add docblock
      this.baseURL = '';

      /** @var {int} The zoom level for when no search has been performed yet (pretty far out) */
      this._initialZoom = 4;

      /** @var {int} The zoom level for when there are search results */
      this._resultsZoom = 10;

      /** @var {float} */
      this._defaultLat = 39.97712;

      /** @var {float} */
      this._defaultLong = -99.587403;

      /** @var {string} */
      this.noResultsMessage =
          'Oops! Sorry, we could not find any testing centers near that location. ' +
          'Please try your search again with a different or less specific address.';

      /** @var {google.maps.Map} */
      this._map = null;

      /** @var {google.maps.Geocoder} */
      this._geoCoder = null;

      /** @var {google.maps.InfoWindow} */
      this._infoWindow = null;

      /** @var {string} */
      this.onlyNetwork = undefined;

      /** @var {string} */
      this.excludeNetworks = undefined;

      /** @var {int} */
      this.limit = undefined;

      /** @var {string} text for the lab selection buttons */
      this.labSelectText = 'Choose This Location';

      /** @var {string} placeholder text for the search input */
      this.searchInputPlaceholder = 'Enter Your Zip';

      /**
       * Initializes the map and sets the default viewport lat / long.
       *
       * @param {{lat:float, long:float}} settings
       */
      this.construct = function(settings) {
        this.find('input').keyup($.proxy(function(e) {
          e.preventDefault();

          if (e.keyCode == 13) {
            this._onSearchSubmit(e);
          }

          return false;
        }, this));

        this.find('[data-findalab-search-button]').on('click', $.proxy(this._onSearchSubmit, this));

        this.setPlaceholder(self.searchInputPlaceholder);

        settings = settings || {};

        if (typeof google === 'undefined') {
          alert('Hey! The Google Maps script is missing or not properly called, please check ' +
          'the Medology Find A Labs component documentation to make sure everything is ' +
          'setup correctly.');
        }

        var mapOptions = {
          center: this._buildLatLong(settings.lat, settings.long),
          zoom: this._initialZoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        };

        this._map = new google.maps.Map(document.getElementById('map'), mapOptions);

        this._geoCoder = new google.maps.Geocoder();

        this._infoWindow = new google.maps.InfoWindow();

        // Capture lab selection events
        this.on('click', '[data-findalab-result-button]', $.proxy(function(event) {
          event.preventDefault();
          this._onLabSelect($(event.target).data());
          return false;
        }, this));
      };

      /**
       * This functionwill handle clearing error text.
       */
      this.clearError = function() {
        this.find('[data-findalab-error]').html('');
      };

      /**
       * Returns the country code for the specified zip code.
       *
       * Currently only supports Canada, United States and Puerto Rico.
       *
       * @param   {string} zipCode The zipCode to get the country code for.
       * @returns {string} The two character country code. Either CA, PR or US.
       */
      this.getZipCodeCountry = function(zipCode) {
        var caRegex = new RegExp(
          /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i
        );

        if (caRegex.test(zipCode)) {
          return 'CA';
        }

        // Check for Puerto Rico zips
        var intZip = parseInt(zipCode);
        if ((intZip >= 600 && intZip <= 799) || (intZip >= 900 && intZip <= 999)) {
          return 'PR';
        }

        if (isNaN(intZip)) {
          return 'Unknown';
        }

        return 'US';
      };

      /**
       * Triggers the Google Maps resize event.
       *
       * Useful for when the map was hidden when it booted.
       */
      this.resize = function() {
        google.maps.event.trigger(this._map, 'resize');
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
       *   id:int
       *   network:string
       *   address:string
       *   city:string
       *   state:string
       *   zip:int
       * }} lab
       */
      this.onLabSelect = function(lab) {
        // override me!
      };

      /**
       * This functionwill retrieve latitude and longitudes and also labs
       * near these coordinates.
       */
      this.search = function(zipcode) {
        this.clearError();
        // $('[data-findalab-result-list]').html('');

        this.find('[data-findalab-search-field]').val(zipcode);

        try {
          var country = this.getZipCodeCountry(zipcode);
          if (country == 'Unknown') {
            throw this.noResultsMessage;
          }

          this.onSearchSubmit(zipcode, country);
        } catch (error) {
          this.setError(error);
          return;
        }

        $('[data-findalab-search-button]').html('<i class="fa fa-spin fa-refresh"></i>');

        $.ajax({
          url: this.baseURL + '/geocode',
          dataType: 'json',
          data: { zip: zipcode, countryCode: country },
        }).done(
            /**
             * @param {[{latitude:float, longitude:float, countryCode:string}]}  result
             */
            function(result) {
              if (result.length == 0) {
                self._onSearchErrorString('No Results');
              }

              $.ajax({
                url: self.baseURL + '/labs/nearCoords',
                dataType: 'json',
                data: $.extend({
                  countryCode: country,
                  filterNetwork: self.excludeNetworks,
                  labCount: self.limit,
                  network: self.onlyNetwork,
                }, result[0]),
              }).
              done(self._onSearchSuccess).
              fail(self._onSearchError).
              always($.proxy(self._onSearchComplete, self));
            }).fail(function(jqXhr) {
          self._onSearchError(jqXhr);
          self._onSearchComplete();
        });
      };

      /**
       * Sets the placeholder text for the search input.
       *
       * @param {string} message the placeholder message
       */
      this.setPlaceholder = function(message) {
        this.find('[data-findalab-search-field]').attr('placeholder', message);
      };

      /**
       * Sets the text to display on the lab select buttons.
       *
       * @param {string} text
       */
      this.setLabSelectText = function(text) {
        this.find('[data-findalab-result-button]').html(text);
        this.labSelectText = text;
      };

      /**
       * Displays the specified error message to the user.
       *
       * @param {string} message This is the error message that will be shown.
       */
      this.setError = function(message) {
        console.log(message);
        this.find('[data-findalab-error]').html(
          '<div class="small alert callout findalab__error">' +
          '<i class="fa fa-warning"></i> ' +
          message +
          '</div>'
        );
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
        lat = lat !== undefined ? lat : this._defaultLat;
        long = long !== undefined ? long : this._defaultLong;

        return new google.maps.LatLng(lat, long);
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
          $link.text($toggle.is(':visible') ? 'Show Hours ▼' : 'Hide Hours ▲');
          $toggle.slideToggle('300');
        });
      };

      /**
       * Centers the map to the specified coordinates.
       *
       * @param {float} lat   The latitude to center to.
       * @param {float} long  The longitude to center to.
       * @private
       */
      this._centerMap = function(lat, long) {
        this._map.setCenter(this._buildLatLong(lat, long));

        this._geoCoder.geocode({
              address: lat + ',' + long,
            },
            /**
             * @param {[{geometry:{}}]} results
             * @param status
             */
            function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                self._map.setCenter(results[0].geometry.location);
              } else {
                alert('Geocode was not successful for the following reason: ' + status);
              }
            }
        );
      };

      /**
       * Private event handler for when the user selects a lab.
       *
       * @param {{
       *   id:int
       *   network:string
       *   address:string
       *   city:string
       *   state:string
       *   zip:int
       * }} lab
       */
      this._onLabSelect = function(lab) {
        this.onLabSelect(lab);
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
       *    center_network:string
       *    center_country:string
       *    network_name:string,
       * }} lab
       * @private
       */
      this._showMarker = function(lab) {
        var location = this._buildLatLong(lab.center_latitude, lab.center_longitude);
        var vMarker;

        var mapMarker = {
          path: 'm-13.86316,-25.61974l10.845,22.96658c0.31974,0.69158 0.79816,1.17' +
          '1.38316,1.54184c0.63711,0.37184 1.32868,0.585 2.02026,0.585c0.69158,0 1.38079,-0.21316' +
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
          fillColor: '#3398db',
          fillOpacity: 1,
          scale: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        };

        vMarker = new google.maps.Marker({
          map: this._map,
          icon: mapMarker,
          position: location,
        });

        google.maps.event.addListener(vMarker, 'click', $.proxy(function() {
          this._infoWindow.setContent(
              '<h6 style="margin: 0;">' + lab.network_name + '</h6>' +
              '<p>' +
              lab.center_address + '<br>' +
              lab.center_city + ', ' + lab.center_state + ' ' + lab.center_zip +
              '</p>' +
              '<a ' +
              'class="[ tiny secondary button ][ ffab-after fa-arrow-right ]" ' +
              'style="margin-bottom: 0;" ' +
              'href="#" ' +
              'data-id="' + lab.center_id + '" ' +
              'data-address="' + lab.center_address + '" ' +
              'data-city="' + lab.center_city + '" ' +
              'data-state="' + lab.center_state + '" ' +
              'data-zip="' + lab.center_zip + '" ' +
              'data-network="' + lab.network_name + '" ' +
              'data-country="' + lab.center_country + '"' +
              '>' +
              this.labSelectText +
              '</a>'
          );

          // noinspection JSUnresolvedFunction
          this._infoWindow.open(this._map, vMarker);
        }, this));
      };

      /**
       * This functionwill handle rendering labs.
       * @param {[{
       *   center_id:int,
       *   center_address:string,
       *   center_city:string,
       *   center_state:string,
       *   center_zip:string,
       *   center_hours:string,
       *   center_network:string,
       *   center_distance:float,
       *   network_name:string,
       *   structured_hours:object
       * }]} labs
       * @private
       */
      this._render = function(labs) {
        // $('.bg_map_image').hide(); // hide empty results
        // $('.result-map-wrap').show(); // remove?

        var html = '';
        var $resultsList = this.find('[data-findalab-result-list]');
        var $resultTemplate = this.find('[data-findalab-result]');
        var $rowTemplate = this.find('[data-findalab-structured-hours-row]');

        var pluralLabs = labs.length > 1 ? 's' : '';
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
         *   network_name:string,
         *   structured_hours:object
         * }} lab
         */
        $.each(labs, $.proxy(function(index, lab) {
          var $result = $resultTemplate.clone();
          $result.find('[data-findalab-result-title]').html(lab.network_name);
          $result.find('[data-findalab-result-address]').html(
            lab.center_address + '<br>' +
            lab.center_city + ', ' + lab.center_state + ' ' + lab.center_zip
          );
          $result.find('[data-findalab-result-distance]').html(
            lab.center_distance.toFixed(2)
          );
          $result.find('[data-findalab-result-button]')
          .attr('data-id', lab.center_id)
          .attr('data-address', lab.center_address)
          .attr('data-city', lab.center_city)
          .attr('data-state', lab.center_state)
          .attr('data-zip', lab.center_zip)
          .attr('data-network', lab.network_name)
          .html(this.labSelectText);

          if (!lab.structured_hours) {
            $result.find('[data-findalab-result-hours]').html(labData.center_hours);
          } else {
            // var hours = this._buildHoursDom(lab);
          }

          // $result.find('[data-findalab-structured-hours-body]').html(hours);

          $result.removeClass('hide').appendTo('[data-findalab-result-list]');

        }, this));

        // $resultsList.html('');
        // TODO: Clear old results

        this._initShowStructuredHours();

        labs.map($.proxy(this._showMarker, this));

        if (labs[0]) {
          this._centerMap(labs[0].center_latitude, labs[0].center_longitude);
          this._map.setZoom(this._resultsZoom);
        }
      };

      /**
       * Builds the structured hours DOM for a Lab entry.
       *
       * @param   {{center_id:int, center_hours:string, structured_hours:object}} labData
       * @returns {string} The structured hours DOM.
       * @private
       */
      this._buildHoursDom = function(labData) {
        var html = '';
        /**
         * @param {{string}} day
         * @param {{open:string, close:string, lunch_start:string, lunch_stop:string}} hours
         */
        $.each(labData.structured_hours, function(day, hours) {
          html += '<tr data-findalab-structured-hours-row>' +
            '<th>' +
              '<div>' +
                '<small data-findalab-result-day>' +
                day +
                '</small>' +
              '</div>' +
              '<div data-findalab-result-day-lunch>' +
                '<small>Closed for Lunch</small>' +
              '</div>' +
            '</th>' +
            '<td class="text-right">' +
              '<div>' +
                '<small data-findalab-result-hours></small>' +
              '</div>' +
              '<div data-findalab-result-day-lunch>' +
                '<small data-findalab-result-hours-lunch></small>' +
              '</div>' +
            '</td>' +
          '</tr>'

          if (hours.lunch_start) {
            $row.find('[data-findalab-result-hours-lunch]').html(
              hours.lunch_start + ' - ' + hours.lunch_stop
            );
          } else {
            $row.find('[data-findalab-result-day-lunch]').remove();
          }
          $row.find('[data-findalab-result-day]').html(day);
          $row.find('[data-findalab-result-hours]').html(
            hours.open + ' - ' + hours.close
          );
          // var html += html;
        });
      };

      /**
       * Private event handler for a search is initiated.
       *
       * @private
       */
      this._onSearchSubmit = function(event) {
        event.preventDefault();

        var zip = this.find('[data-findalab-search-field]').val();

        this.search(zip);

        return false;
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
       *    network_name:string,
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
          self._render(response.labs);
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
        this.find('[data-findalab-result-list]').html('<li>No Results.</li>');

        self.setError(this.noResultsMessage);
        self.onSearchError(JSON.parse(message).message);
      };

      /**
       * This functionwill handle clean up after searches regardless of server response.
       * @private
       */
      this._onSearchComplete = function() {
        this.find('[data-findalab-search-button]').html('<i class="fa fa-search"></i>');
      };

      this.construct(settings);

      return this;
    },
  });
})(jQuery);
