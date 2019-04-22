<?php namespace features\contexts;

use Behat\Behat\Context\Context;
use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Behat\FlexibleMink\Context\SpinnerContext;
use Behat\Mink\Element\NodeElement;
use Behat\Mink\Exception\ExpectationException;
use Exception;
use features\bootstrap\WebContext;
use features\interfaces\GathersContexts;
use features\traits\GathersContexts as GatherContextTrait;

/**
 * Behat context for testing findalab map content.
 */
class MapContext implements Context, GathersContexts
{
    use SpinnerContext;
    use GatherContextTrait;

    /** @var WebContext */
    protected $web_context;

    /**
     * {@inheritdoc}
     */
    public function gatherContexts(BeforeScenarioScope $scope)
    {
        $env = $this->getEnvironment($scope);
        $this->web_context = $env->getContext(WebContext::class);
    }

    /**
     * Asserts that there are a certain number of pins on the google map displayed on the page.
     *
     * @Then there are :number :type pins on the map
     * @Then there is a :type pin on the map
     * @Then there is 1 :type pin on the map
     * @Then there should be :number pins on the map
     * @Then there should be a :type pin on the map
     * @Then there should be 1 :type pin on the map
     *
     * @param  int                  $number The number of pins to check for. Defaults to 1.
     * @throws ExpectationException if there are more or less than $number of pins
     * @throws Exception
     */
    public function assertPinsOnMap($number = 1)
    {
        $num_of_pins = $this->web_context->getSession()->evaluateScript(
        /* @lang JavaScript */'return window.labfinder.settings.googleMaps.markers.length'
        );

        if ($num_of_pins != $number) {
            throw new ExpectationException(
                "Expected $number pins, but found " . $num_of_pins . ', instead.', $this->web_context->getSession()
            );
        }
    }

    /**
     * Clicks on the marker by its title.
     *
     * @When /^I click on the "(?P<title>[^"]*)" marker/
     *
     * @param  string    $title The title of the marker
     * @throws Exception When marker not found
     */
    public function clickMarkerByTitle($title)
    {
        $this->waitFor(function () use ($title) {
            /** @var NodeElement $marker */
            $marker = $this->web_context->getSession()->getPage()->find('css', 'div[title="' . $title . '"]');

            if (!$marker) {
                throw new Exception("Marker \"$title\" not found on map");
            }

            $marker->click();
        });
    }

    /**
     * Assert if the lab with title appears in the view port of search result.
     *
     * @Then /^"(?P<title>[^"]*)" should (?:|(?P<not>not ))be in the viewport of search result$/
     *
     * @param  null|string $not   If the lab should appear.
     * @param  string      $title The title of the lab.
     * @throws Exception   When Lab is not found in the search result.
     * @return bool
     */
    public function assertLabResultVisible($title, $not = null)
    {
        $labTitles = $this->web_context->getSession()->getPage()->findAll('css', '[data-findalab-result-title]');

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

    /**
     * Assert if the map is zoomed to a particular level.
     *
     * @Then the findalab map should be zoomed to at least level :level
     *
     * @param  int       $level The expected minimum zoom level of the map.
     * @throws Exception if the map is not zoomed in to at least the given level.
     */
    public function assertMapZoom($level)
    {
        $zoom = $this->web_context->getSession()->evaluateScript(
            /* @lang JavaScript */'return window.labfinder.settings.googleMaps.map.getZoom()'
        );

        if ($zoom < $level) {
            throw new Exception("Expected zoom of $level or greater, but got $zoom");
        }
    }

    /**
     * Sets the filter for the lab hours.
     *
     * @When I set the lab hours to :hours
     *
     * @param  string               $label The lab hours option to select.
     * @throws ExpectationException When the lab hours option is not found.
     */
    public function setLabHours($label)
    {
        /** @var NodeElement $label */
        $label = $this->web_context->getSession()->getPage()->find('xpath', "//label[text()=\"$label\"]");
        if (is_null($label)) {
            throw new ExpectationException('The lab hours option was not found on the page.', $this->web_context->getSession());
        }

        $label->click();
    }
}
