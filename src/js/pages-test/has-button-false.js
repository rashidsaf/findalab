import findALab from "../findalab";

window.initMap = function() {
  findALab('#findalab').load('/template/findalab.html', function() {
    window.labfinder = findALab(this).find('.findalab').findalab({
      baseURL: 'http://findalab.local/fixtures/simple-mockups',
      lab: {
        hasButton: false,
      }
    });
  });
}
