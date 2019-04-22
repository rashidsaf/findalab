<?php require __DIR__ . '/../bootstrap/app.php' ?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Findalab - Closed Lab</title>
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

<h1>Find A Lab - Hidden and Preloaded</h1>
<div id="map-ready">Map Is Not Ready</div>
<button id="map-show" type="button">Show Map</button>
<div id="hidden" style="display: none">
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
</div>

<script src="/js/lib/jquery.js"></script>
<script src="/js/findalab.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=<?= env('GOOGLE_MAP_API_KEY'); ?>&amp;callback=initMap" async></script>
<div id="APIKey" data-api-key="<?= env('GOOGLE_MAP_API_KEY'); ?>" ></div>

<script>
    function initMap() {
        $('#findalab').load('/template/findalab.html', function() {
            window.labfinder = $(this).find('.findalab').findalab({
                baseURL: 'http://findalab.local/fixtures/hidden-preloaded'
            });

            window.labfinder.onSearchSuccess = function() {
                $('#map-show').on('click', function() {
                    $('#hidden').show();
                    window.labfinder.resize();
                    $(this).hide();
                });
                $('#map-ready').text('Map Ready');
            };

            window.labfinder.search('96814');
        });
    }
</script>
</body>
</html>
