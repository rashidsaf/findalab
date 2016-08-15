<?php

$paths = [
    '/geocode',
    '/labs/nearCoords',
    '/phlebotomists/nearCoords',
];

if (in_array($_SERVER['REQUEST_URI'], $paths)) {
    header('Status: 404 Not Found');
    exit();
}

$zip = $_GET['zip'];
$countryCode = $_GET['countryCode'];




