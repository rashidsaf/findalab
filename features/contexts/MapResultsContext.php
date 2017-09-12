<?php namespace features\contexts;

use Behat\Gherkin\Node\TableNode;
use Behat\Mink\Exception\ExpectationException;
use InvalidArgumentException;

/**
 * Behat context for testing findalab map results content.
 */
trait MapResultsContext
{
    // Implements
    use MapResultsContextInterface;

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

        $session = $this->getSession();
        $page = $session->getPage()->getContent();

        if (!str_contains($page, $lines)) {
            throw new ExpectationException('Could not find result on page', $session);
        }
    }
}
