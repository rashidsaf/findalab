<?php

use Behat\Behat\Context\Context;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\FlexibleMink\Context\FlexibleContext;
use Behat\FlexibleMink\Context\StoreContext;

/**
 * Defines application features from the context of a Web Page.
 */
class WebContext extends FlexibleContext implements Context, SnippetAcceptingContext
{
    use StoreContext;

    protected $base_url = 'http://www.findalab.local';

    /** @var array Context parameters set in the configuration for this context */
    protected $parameters;

    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     *
     * @param string $base_url the base URL for tests using this context
     */
    public function __construct($base_url)
    {
        $this->parameters = ['base_url' => $base_url];
    }

    public function getSession($name = null)
    {
        // TODO: Implement getSession() method.
    }

    public function waitFor(callable $lambda, $timeout = 30)
    {
        // TODO: Implement waitFor() method.
    }

    /**
     * {@inheritdoc}
     *
     * This overrides MinkContext::visit() to inject stored values into the URL.
     */
    public function visit($page)
    {
        parent::visit($this->injectStoredValues($page));
    }
}