<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * The controlelr to mock the filter feature.
 */
class SaturdayFilterController extends LabController
{
    /** @var array number to day of week mapping */
    private $dayMapping = [
        1 => 'Monday',
        2 => 'Tuesday',
        3 => 'Wednesday',
        4 => 'Thursday',
        5 => 'Friday',
        6 => 'Saturday',
        7 => 'Sunday',
    ];

    /**
     * Filter the lab with open day.
     *
     * @param  Request  $request Http request
     * @return Response
     */
    public function labsNearCoords(Request $request)
    {
        if ($dayOnly = $request->get('dayOnly')) {
            $labsResult = array_filter($this->labs, function ($lab) use ($dayOnly) {
                return isset($lab->structured_hours) && isset($lab->structured_hours->{$this->dayMapping[$dayOnly]});
            });

            return response()->json(array_merge([
                'labs'        => array_values($labsResult),
                'resultCount' => count($this->labs),
            ], $this->coord));
        }

        return parent::labsNearCoords($request);
    }
}
