<?php namespace features\contexts;

use Behat\Gherkin\Node\TableNode;
use Behat\Mink\Exception\ExpectationException;

/**
 * Behat context for testing findalab map results content.
 */
trait MapResultsContextInterface
{
    /**
     * Asserts that the specified lab is visible in the search results.
     *
     * @param  TableNode            $table
     * @throws ExpectationException
     */
    abstract public function iShouldSeeTheFollowingLabInTheResults(TableNode $table);
}
