import findALab from "../findalab";

window.initMap = function() {
  //
  findALab('#findalab').load('/template/findalab.html', function() {
    window.labfinder = findALab(this).find('.findalab').findalab({
      baseURL: '/fixtures/simple-mockups',
      userLocation : {
        showOption: true,
        icon: 'fa fa-map-marker',
        msg: 'Locate me',
        loading: {
          icon: 'fa fa-spin fa-spinner',
          msg: 'Searching current location...'
        }
      }
    });
  });

  findALab('#findalab-reset').on('click', function() {
    window.labfinder.reset();
  });
}
