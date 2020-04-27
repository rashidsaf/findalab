<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    return $app->version();
});

$app->get('/saturdayFilter/labs/nearPostalCode', 'SaturdayFilterController@labsNearPostalCode');
$app->get('/saturdayFilter/phlebotomists/nearCoords', 'SaturdayFilterController@phlebotomistsNearCoords');

//Only states filter
$app->get('/onlyStateFilter/labs/nearPostalCode', 'OnlyStatesFilterController@labsNearPostalCode');
$app->get('/onlyStateFilter/phlebotomists/nearCoords', 'OnlyStatesFilterController@phlebotomistsNearCoords');
