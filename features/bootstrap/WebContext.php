<?php

use Behat\Behat\Context\Context;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\FlexibleMink\Context\FlexibleContext;
use Behat\FlexibleMink\Context\StoreContext;
use Behat\FlexibleMink\PseudoInterface\MinkContextInterface;

/**
 * Defines application features from the context of a Web Page.
 */
class WebContext extends FlexibleContext implements Context, SnippetAcceptingContext
{
    use StoreContext;
    use MinkContextInterface;
}
