<?php require __DIR__ . '/../bootstrap/app.php'; ?>
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
  <button class="findalab-reset" type="button">Reset findalab</button>

  <script src="https://maps.googleapis.com/maps/api/js?key=<?= env('GOOGLE_MAP_API_KEY'); ?>"></script>
  <script src="/js/samples/<?php echo basename(__FILE__, '.php'); ?>.js"></script>

  </body>
</html>

