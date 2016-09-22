<?php require __DIR__ . '/config/bootstrap.php' ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Findalab - Simple Mockups</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/css/findalab.css">
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

  <script src="/bower_components/jquery/dist/jquery.js"></script>
  <script src="https://maps.googleapis.com/maps/api/js?key=<?= getenv('GOOGLE_MAP_API_KEY'); ?>"></script>
  <script src="/src/findalab.js"></script>
  <script>
  $('#simple-findalab').load('/src/findalab.html', function() {
    var findalab = $(this).find('.findalab').findalab({
      baseURL: 'http://findalab.local/features/fixtures/no-results'
    });
  });
  </script>
</body>
</html>
