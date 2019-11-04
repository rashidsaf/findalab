import findALab from "../findalab";

window.initMap = function() {
  findALab('#findalab').load('/template/findalab.html', function() {
    window.labfinder = findALab(this).find('.findalab').findalab({
      baseURL: 'http://findalab.local/fixtures/simple-mockups'
    });
    window.labfinder.onLabSelect = function(){
      testDisableEnable();
    };

  });

  findALab('#findalab-keep-lab').on('click', function() {
    testDisableEnable();
  });
  findALab('body').on('click', '[data-findalab-ihc-button]', function(){
    testDisableEnable();
  })

  function testDisableEnable() {
    window.labfinder.showDisabledState();
    setTimeout(function() {
      findALab('#findalab-success-msg').html('<h3>Success!</h3>');
      window.labfinder.removeDisabledState();
    }, 5000);
  }
}
