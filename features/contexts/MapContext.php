<?php namespace features\contexts;

use Behat\FlexibleMink\PseudoInterface\MinkContextInterface;
use Behat\Mink\Element\NodeElement;
use Behat\Mink\Exception\ExpectationException;
use Exception;

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

    /**
     * {@inheritdoc}
     *
     * @When /^I click on the "(?P<title>[^"]*)" marker/
     */
    public function clickMarkerByTitle($title)
    {
        /** @var NodeElement $marker */
        $marker = $this->getSession()->getPage()->find('css', 'div[title="' . $title . '"]');

        if (!$marker) {
            throw new Exception("Marker \"$title\" not found on map");
        }

        $marker->click();
    }


    /**
     * {@inheritdoc}
     *
     * @Then /^"(?P<title>[^"]*)" should (?:|(?P<not>not ))be in the viewport of search result$/
     */
    public function assertLabResultVisible($not = null, $title)
    {
        $labTitles = $this->getSession()->getPage()->findAll('css', '[data-findalab-result-title]');

        /** @var NodeElement $labTitle */
        foreach ($labTitles as $labTitle) {
            if ($labTitle->getText() == $title) {
                if ($not && $labTitle->isVisible()) {
                    throw new Exception("Lab \"$title\" should not be visible");
                }
                if (!$not && !$labTitle->isVisible()) {
                    throw new Exception("Lab \"$title\" should be visible");
                }

                return true;
            }
        }
        throw new Exception("Lab \"$title\" not exist in the search result.");
    }
}
