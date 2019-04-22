<?php namespace features\contexts;

use Behat\Behat\Context\Context;
use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Behat\FlexibleMink\Context\SpinnerContext;
use Behat\Gherkin\Node\TableNode;
use Behat\Mink\Element\NodeElement;
use Behat\Mink\Exception\ExpectationException;
use Exception;
use features\bootstrap\WebContext;
use features\interfaces\GathersContexts;
use features\traits\GathersContexts as GatherContextTrait;
use InvalidArgumentException;

/**
 * Behat context for testing findalab map results content.
 */
class MapResultsContext implements Context, GathersContexts
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
     * Asserts that the specified lab is visible in the search results.
     *
     * @Then I should see the following lab in the results:
     *
     * @param  TableNode            $table Representation of the expected attributes of the lab.
     * @throws ExpectationException If the expected lab is not visible in the search results.
     * @throws Exception            If the spinner function throws an exception.
     */
    public function iShouldSeeTheFollowingLabInTheResults(TableNode $table)
    {
        if (count($table->getRow(0)) > 1) {
            throw new InvalidArgumentException('Arguments must be a single-column list of items');
        }

        $lines = implode('<br />', $table->getColumn(0));

        $this->waitFor(function () use ($lines) {
            $session = $this->web_context->getSession();
            $page = $session->getPage()->getContent();

            if (!str_contains($page, $lines)) {
                throw new ExpectationException('Could not find result on page', $session);
            }
        });
    }

    /**
     * Asserts that the specific attributes.
     *
     * @param  TableNode            $expectedData TableNode representation of the expected attributes.
     * @throws ExpectationException If one of the expected attributes does not exist in the found select lab button.
     * @throws ExpectationException If a Select Lab button does not exist.
     *
     * @Then the following lab data should be available for the lab selected:
     */
    public function assertLabDataAvailable(TableNode $expectedData)
    {
        $button = $this->assertLabSelectButton();
        $expectedDataArray = $expectedData->getColumn(0);

        array_map(function ($expectedAttribute) use ($button) {
            if (!$button->hasAttribute($expectedAttribute)) {
                throw new ExpectationException(
                    "The '$expectedAttribute' attribute was not found in the Lab Select Button Found.",
                    $this->web_context->getSession()
                );
            }
        }, $expectedDataArray);
    }

    /**
     * Retrieves the lab select button for the lab.
     *
     * @throws ExpectationException If a select lab is not found on the page.
     * @return NodeElement
     */
    public function assertLabSelectButton()
    {
        $button = $this->web_context->getSession()->getPage()->find('xpath', "//button[contains(text(), 'Choose This Location')]");

        if (!$button) {
            throw new ExpectationException('A select lab button was not found on the page.', $this->web_context->getSession());
        }

        return $button;
    }
}
