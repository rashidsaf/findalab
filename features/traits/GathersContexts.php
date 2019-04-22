<?php namespace features\traits;

use Behat\Behat\Context\Environment\InitializedContextEnvironment;
use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use RuntimeException;

/**
 * Interface for Behat contexts that utilize other Contexts.
 *
 * This interface defines a single function that is triggered before each Behat scenario. The implementing class
 * should use this function to gather any contexts from the environment that it needs to interact with.
 *
 * @see http://behat-docs.readthedocs.io/en/mvp1.0/cookbooks/gathering_contexts_when_using_multiple_contexts.html
 */
trait GathersContexts
{
    /**
     * Gets the environment in order to do gathersContexts.
     *
     * This should be called at the beginning of any implementation of gathersContexts, and will return the environment.
     *
     * @param  BeforeScenarioScope           $scope
     * @throws RuntimeException              If the current environment is not initialized.
     * @return InitializedContextEnvironment
     */
    public function getEnvironment(BeforeScenarioScope $scope)
    {
        $environment = $scope->getEnvironment();
        if (!($environment instanceof InitializedContextEnvironment)) {
            throw new RuntimeException(
                'Expected Environment to be ' . InitializedContextEnvironment::class .
                ', but got ' . get_class($environment)
            );
        }

        return $environment;
    }
}
