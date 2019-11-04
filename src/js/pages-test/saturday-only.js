import findALab from "../findalab";

window.initMap = function() {
  findALab('#findalab').load('/template/findalab.html', function() {
    window.labfinder = findALab(this).find('.findalab').findalab({
      baseURL: 'http://findalab.local/saturdayFilter',
      dayOfWeekFilter: {showOption: true}
    });
  });
  findALab('#findalab-reset').on('click', function() {
    window.labfinder.reset();
  });
}
