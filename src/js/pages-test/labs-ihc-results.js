import findALab from "../findalab";

window.initMap = function() {

  findALab('#findalab').load('/template/findalab.html', function() {
    window.labfinder = findALab(this).find('.findalab').findalab({
      baseURL: 'http://findalab.local/fixtures/labs-ihc-results'
    });
  });
  findALab('#findalab-reset').on('click', function() {
    window.labfinder.reset();
  });
}
