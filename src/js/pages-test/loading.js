import findALab from "../findalab";

window.initMap = function() {
  setTimeout(function() {
    window.labfinder = findALab('#findalab').load('/template/findalab.html', function() {
      findALab(this).find('.findalab').findalab({
        baseURL: 'http://findalab.local/fixtures/simple-mockups',
        lab: {
          hasButton: false,
        }
      });
    });
  }, 3000);
}
