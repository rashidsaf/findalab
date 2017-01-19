<?php require __DIR__ . '/../bootstrap/app.php' ?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Findalab - Disable Buttons on Submit</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/dist/findalab.css">
    <style>
        body {
            margin: 0 auto;
            max-width: 900px;
            padding: 10px;
        }
        #findalab-success-msg {
            color: green;
            margin: 16px;
        }
    </style>
  </head>
  <body>

    <h1>Find A Lab - Simple Mockups</h1>
    <div id="findalab">
      <div class="findalab-loading">
        <div class="findalab-loading__content">
          <h2>Loading Test Centers</h2>
          <img
            src="/three-dots.svg"
            alt="loading"
            width="50"
            onerror="this.src='/loading-gif.gif';this.onerror=null;" />
        </div>
      </div>
    </div>

    <button id="findalab-keep-lab" type="button" style="margin-top: 16px; font-size: 16px;">Keep Current Lab</button>

    <div id="findalab-success-msg"></div>

    <script src="/bower_components/jquery/dist/jquery.js"></script>
    <script src="/js/findalab.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=<?= env('GOOGLE_MAP_API_KEY'); ?>&amp;callback=initMap" async></script>

    <script>
     function initMap() {
        var findalab;
        $('#findalab').load('/template/findalab.html', function() {
            findalab = $(this).find('.findalab').findalab({
                baseURL: 'http://findalab.local/fixtures/simple-mockups'
            });
            findalab.onLabSelect = function(){
                testDisableEnable();
            };

        });

        $('#findalab-keep-lab').on('click', function() {
            testDisableEnable();
        });
        $('body').on('click', '[data-findalab-ihc-button]', function(){
            testDisableEnable();
        })

        function testDisableEnable() {
            findalab.showDisabledState();
            setTimeout(function() {
                $('#findalab-success-msg').html('<h3>Success!</h3>');
                findalab.removeDisabledState();
            }, 5000);
        }
     }
    </script>

  </body>
</html>
