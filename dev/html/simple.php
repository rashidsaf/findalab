<?php require __DIR__ . '/../bootstrap/app.php' ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Findalab - Simple Mockups</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/dist/findalab.css">
  <style>
    body {
      margin: 0 auto;
      max-width: 900px;
      padding: 10px;
    }
  </style>
</head>
<body>

  <h1>Find A Lab - Simple Mockups</h1>
  <div id="simple-findalab"></div>
  <button class="findalab-reset" type="button">Reset findalab</button>

  <script src="/bower_components/jquery/dist/jquery.js"></script>
  <script src="https://maps.googleapis.com/maps/api/js?key=<?= env('GOOGLE_MAP_API_KEY'); ?>"></script>
  <script src="/js/findalab.js"></script>
  <script>
  $('#simple-findalab').load('/template/findalab.html', function() {
    var findalab = $(this).find('.findalab').findalab({
      baseURL: 'http://findalab.local/simple-mockups',
      googleMaps: {
        mapMarkerFillColor: '#0000ee'
      },
      lab: {
        buttonText: 'Choose this place, yo!'
      },
      search: {
        buttonText: 'Find Simple',
        placeholder: 'Fill in the zippaty codes'
      }
    });

    $('.findalab-reset').on('click', function() {
      findalab.reset();
    });
  });
  </script>
</body>
</html>
