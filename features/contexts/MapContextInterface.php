<?php namespace features\contexts;

use Behat\Mink\Exception\ExpectationException;

/**
 * Behat context for testing findalab map content.
 */
trait MapContextInterface
{
    /**
     * Asserts that there are a certain number of pins on the google map displayed on the page.
     *
     * @param  int                  $number The number of pins to check for. Defaults to 1.
     * @throws ExpectationException if there are more or less than $number of pins
     */
    abstract public function assertPinsOnMap($number = 1);
}
