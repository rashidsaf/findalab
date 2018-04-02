<?php namespace features\contexts;

use Behat\FlexibleMink\PseudoInterface\SpinnerContextInterface;
use Behat\Gherkin\Node\TableNode;
use Behat\Mink\Element\NodeElement;
use Behat\Mink\Exception\ExpectationException;
use InvalidArgumentException;

/**
 * Behat context for testing findalab map results content.
 */
trait MapResultsContext
{
    // Implements
    use MapResultsContextInterface;
    use SpinnerContextInterface;

    /**
     * {@inheritdoc}
     *
     * @Then I should see the following lab in the results:
     */
    public function iShouldSeeTheFollowingLabInTheResults(TableNode $table)
    {
        if (count($table->getRow(0)) > 1) {
            throw new InvalidArgumentException('Arguments must be a single-column list of items');
        }

        $lines = implode('<br />', $table->getColumn(0));

        $this->waitFor(function () use ($lines) {
            $session = $this->getSession();
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
                    $this->getSession()
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
        $button = $this->getSession()->getPage()->find('xpath', "//button[contains(text(), 'Choose This Location')]");

        if (!$button) {
            throw new ExpectationException('A select lab button was not found on the page.', $this->getSession());
        }

        return $button;
    }
}
