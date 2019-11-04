import findALab from "../findalab";

window.initMap = function() {
  findALab('#findalab').load('/template/findalab.html', function() {
    window.labfinder = findALab(this).find('.findalab').findalab({
      baseURL: 'http://findalab.local/fixtures/hidden-preloaded'
    });

    window.labfinder.onSearchSuccess = function() {
      findALab('#map-show').on('click', function() {
        findALab('#hidden').show();
        window.labfinder.resize();
        findALab(this).hide();
      });
      findALab('#map-ready').text('Map Ready');
    };

    window.labfinder.search('96814');
  });
}
