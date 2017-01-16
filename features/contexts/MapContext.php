<?php namespace features\contexts;

use Behat\FlexibleMink\PseudoInterface\MinkContextInterface;
use Behat\Mink\Exception\ExpectationException;

/**
 * Behat context for testing findalab map content.
 */
trait MapContext
{
    // Implements
    use MapContextInterface;
    // Depends.
    use MinkContextInterface;

    /**
     * {@inheritdoc}
     * @Then there are :number pins on the map
     * @Then there is a pin on the map
     * @Then there is 1 pin on the map
     * @Then there should be :number pins on the map
     * @Then there should be a pin on the map
     * @Then there should be 1 pin on the map
     */
    public function assertPinsOnMap($number = 1)
    {
        // This rather awkward xpath expression finds all the pins on the map.
        $xpathString = '//*[contains(@class, "gmnoprint")]/img[@src="https://maps.gstatic.com/mapfiles/transparent.png"]/parent::*';

        $pins = $this->getSession()->getPage()->findAll('xpath', $xpathString);
        if (count($pins) != $number) {
            throw new ExpectationException("Expected $number pins, but found " . count($pins) . ', instead.', $this->getSession());
        }
    }
}
