(function ($) {
  $.fn.extend({
    /**
     * Controller for Lab Search component.
     *
     * @param   {{lat:float, long:float}} settings
     * @returns {labSearch}
     */
    labSearch: function (settings) {
      var self = _this;

      /** @var {int} The zoom level for when no search has been performed yet (pretty far out) */
      this._initialZoom = 3;

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

      /**
       * Initializes the map and sets the default viewport lat / long.
       *
       * @param {{lat:float, long:float}} settings
       */
      this.construct = function (settings) {
        this.find('input').keyup($.proxy(function (e) {
          e.preventDefault();

          if (e.keyCode == 13) {
            this._onSearchSubmit(e);
          }

          return false;
        }, this));

        this.find('.btn_find_lab').on('click', $.proxy(this._onSearchSubmit, this));

        settings = settings || {};

        var mapOptions = {
          center: this._buildLatLong(settings.lat, settings.long),
          zoom: this._initialZoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        };

        this._map = new google.maps.Map(document.getElementById('map'), mapOptions);

        this._geoCoder = new google.maps.Geocoder();

        this._infoWindow = new google.maps.InfoWindow();

        // Capture lab selection events
        this.on('click', '.btn_select_address', $.proxy(function (event) {
          event.preventDefault();

          this._onLabSelect($(event.target).data());

          return false;
        }, this));
      };

      /**
       * This function will handle clearing error text.
       */
      this.clearError = function () {
        this.find('.message').html('');
      };

      /**
       * Returns the country code for the specified zip code.
       *
       * Currently only supports Canada, United States and Puerto Rico.
       *
       * @param   {string} zipCode The zipCode to get the country code for.
       * @returns {string} The two character country code. Either CA, PR or US.
       */
      this.getZipCodeCountry = function (zipCode) {
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
      this.resize = function () {
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
      this.onSearchSubmit = function (zip) {
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
      this.onSearchSuccess = function (labs, lat, long) {
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
      this.onSearchError = function (message) {
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
      this.onLabSelect = function (lab) {
        // override me!
      };

      /**
       * This function will retrieve latitude and longitudes and also labs
       * near these coordinates.
       */
      this.search = function (zipcode) {
        this.clearError();
        $('#results_list').html('');

        this.find('input[name="inputZipSearch"]').val(zipcode);

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

        $('.btn_find_lab').html('<i class="fa fa-spin fa-refresh"></i>');

        $.ajax({
          url: '/geocode',
          data: { zip: zipcode, countryCode: country },
        }).done(
            /**
             * @param {[{latitude:float, longitude:float, countryCode:string}]}  result
             */
            function (result) {
              if (result.length == 0) {
                self._onSearchErrorString('No Results');
              }

              $.ajax({
                url: '/labs/nearCoords',
                data: $.extend({
                  countryCode: country,
                  filterNetwork: self.excludeNetworks,
                  labCount: self.limit,
                  network: self.onlyNetwork,
                }, result[0]),
              }).
              done(self._onSearchSuccess).
              fail(self._onSearchError).
              always(self._onSearchComplete);
            }).fail(function (jqXhr) {
          self._onSearchError(jqXhr);
          self._onSearchComplete();
        });
      };

      /**
       * Sets the placeholder text for the search input.
       *
       * @param {string} message the placeholder message
       */
      this.setPlaceholder = function (message) {
        this.find('input[name="inputZipSearch"]').attr('placeholder', message);
      };

      /**
       * Sets the text to display on the lab select buttons.
       *
       * @param {string} text
       */
      this.setLabSelectText = function (text) {
        this.find('.btn_select_address').html(text);
        this.labSelectText = text;
      };

      /**
       * Displays the specified error message to the user.
       *
       * @param {string} message This is the error message that will be shown.
       */
      this.setError = function (message) {
        this.find('.message').html(
          '<div id="unmistakable-error" class="row us-labs-error">' +
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
      this._buildLatLong = function (lat, long) {
        lat = lat !== undefined ? lat : this._defaultLat;
        long = long !== undefined ? long : this._defaultLong;

        return new google.maps.LatLng(lat, long);
      };

      /**
       * Initializes the "Show Hours" link for Labs.
       *
       * @private
       */
      this._initShowStructuredHours = function () {
        /**
         * Hide/Show Hours
         * @see https://css-tricks.com/snippets/jquery/toggle-text/
         */
        $('.c-hours__link').on('click', function (e) {
          var $link = $(this);
          var toggle = $link.siblings('.c-hours__toggle-js');
          $link.text(toggle.is(':visible') ? 'Show Hours ▼' : 'Hide Hours ▲');
          toggle.slideToggle('300');

          e.preventDefault();
        });
      };

      /**
       * Centers the map to the specified coordinates.
       *
       * @param {float} lat   The latitude to center to.
       * @param {float} long  The longitude to center to.
       * @private
       */
      this._centerMap = function (lat, long) {
        this._map.setCenter(this._buildLatLong(lat, long));

        this._geoCoder.geocode({
              address: lat + ',' + long,
            },
            /**
             * @param {[{geometry:{}}]} results
             * @param status
             */
            function (results, status) {
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
      this._onLabSelect = function (lab) {
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
      this._showMarker = function (lab) {
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

        google.maps.event.addListener(vMarker, 'click', $.proxy(function () {
          this._infoWindow.setContent(
              '<div class="addressMarker">' +
              '<div class="addressMarker__lab">' + lab.network_name + '</div>' +
              '<p>' +
              lab.center_address + '<br />' +
              lab.center_city + ', ' + lab.center_state + ' ' + lab.center_zip + '<br/>' +
              '<a ' +
              'class="btn_select_address" ' +
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
              '</a>' +
              '</p>' +
              '</div>'
          );

          //noinspection JSUnresolvedFunction
          this._infoWindow.open(this._map, vMarker);
        }, this));
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
       *   network_name:string,
       *   structured_hours:object
       * }]} labs
       * @private
       */
      this._render = function (labs) {
        $('.bg_map_image').hide();
        $('.result-map-wrap').show();

        var html = '';
        var $resultsList = $('#results_list');

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
        $.each(labs, $.proxy(function (index, lab) {
          html += '<li>' +
              '<div class="address-list__title">' + lab.network_name + '</div>' +
              '<address class="address-list__address">' +
              lab.center_address + '<br>' +
              lab.center_city + ', ' + lab.center_state + ' ' + lab.center_zip +
              '</address>' +
              '<dl>' +
              '<dt>Distance:</dt>' +
              '<dd>' + lab.center_distance.toFixed(2) + 'mi.</dd>' +
              this._buildHoursDom(lab) +
              '<a ' +
              'class="btn_select_address" ' +
              'href="#" ' +
              'data-id="' + lab.center_id + '" ' +
              'data-address="' + lab.center_address + '" ' +
              'data-city="' + lab.center_city + '" ' +
              'data-state="' + lab.center_state + '" ' +
              'data-zip="' + lab.center_zip + '" ' +
              'data-network="' + lab.network_name + '"' +
              '>' +
              this.labSelectText +
              '</a>' +
              '</dl>' +
              '</li>';
        }, this));

        $resultsList.find('li').remove();
        $resultsList.html(html);

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
      this._buildHoursDom = function (labData) {
        var hours;
        var value;
        var label;
        var html = '';

        if (!labData.structured_hours) {
          html = '<dt>Hours:</dt><dd>' + labData.center_hours + '</dd>';
        } else {
          html += '</dl>' +
              '<div class="c-hours">' +
              '<a href="#" class="c-hours__link" id="' + labData.center_id + '">Show Hours ▼</a>' +
              '<div class="c-hours__toggle-js">' +
              '<table class="c-hours__table">';

          /**
           * @param {{string}} day
           * @param {{open:string, close:string, lunch_start:string, lunch_stop:string}} hours
           */
          $.each(labData.structured_hours, function (day, hours) {
            label = day;
            value = hours.open + ' - ' + hours.close;

            if (hours.lunch_start) {
              label += '<br><small>Closed for Lunch</small>';
              value += '<br><small>' + hours.lunch_start + ' - ' + hours.lunch_stop + '</small>';
            }

            html += '<tr><th>' + label + '</th><td>' + value + '</td></tr>';
          });

          html += '</table></div></div><dl>';
        }

        return html;
      };

      /**
       * Private event handler for a search is initiated.
       *
       * @private
       */
      this._onSearchSubmit = function (e) {
        e.preventDefault();

        var zip = this.find('input[name="inputZipSearch"]').val();

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
      this._onSearchSuccess = function (response) {
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
      this._onSearchError = function (jqXhr) {
        self._onSearchErrorString(jqXhr.responseText);
      };

      /**
       * Private event handler for when a search fails. (string version)
       *
       * @param {string} message
       * @private
       */
      this._onSearchErrorString = function (message) {
        $('#results_list').html('<li>No Results.</li>');

        self.setError(this.noResultsMessage);
        self.onSearchError(JSON.parse(message).message);
      };

      /**
       * This function will handle clean up after searches regardless of server response.
       * @private
       */
      this._onSearchComplete = function () {
        $('.btn_find_lab').html('Search');
      };

      this.construct(settings);

      return this;
    },
  });
})(jQuery);
