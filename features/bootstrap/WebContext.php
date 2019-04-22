<?php namespace features\bootstrap;

use Behat\Behat\Hook\Scope\AfterStepScope;
use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Behat\FlexibleMink\Context\FlexibleContext;
use Behat\FlexibleMink\Context\ScreenShotContext;
use Behat\Mink\Driver\Selenium2Driver;
use Behat\Mink\Element\NodeElement;
use Behat\Mink\Exception\DriverException;
use Behat\Mink\Exception\ExpectationException;
use Behat\Mink\Exception\UnsupportedDriverActionException;
use Behat\Testwork\Tester\Result\TestResult;
use Exception;
use features\contexts\ArtifactContext;
use features\contexts\ContextHelper;
use features\interfaces\GathersContexts;
use features\traits\GathersContexts as GathersContextsTrait;
use features\traits\TracksWarnings;
use WebDriver\Exception\UnknownError;

/**
 * Defines application features from the context of a Web Page.
 */
class WebContext extends FlexibleContext implements GathersContexts
{
    use GathersContextsTrait;
    use ScreenShotContext;
    use TracksWarnings;

    /** @var ArtifactContext */
    protected $artifacts;

    /** @var int The last set width of the browser. */
    protected $browser_width;

    const WARN_CANNOT_RESIZE = 'Could not resize window. Driver does not support it.';
    const WARN_CANNOT_CHECK_VISIBLE = 'Could not determine element visibility. Driver does not support it.';
    const ERROR_WEBDRIVER_HEADLESS = 'unknown error: failed to change window state to maximized, current state is normal';

    /**
     * {@inheritdoc}
     */
    public function gatherContexts(BeforeScenarioScope $scope)
    {
        $env = $this->getEnvironment($scope);

        $this->artifacts = $env->getContext(ArtifactContext::class);
    }

    /**
     * Initializes the window size.
     *
     * @throws DriverException
     *
     * @BeforeScenario
     */
    public function initWindowSize()
    {
        $this->fullScreenWindow();
    }

    /**
     * @throws DriverException
     */
    protected function fullScreenWindow()
    {
        try {
            $this->getSession()->getDriver()->maximizeWindow();

            $this->browser_width = env('WEBDRIVER_WIDTH');
        } catch (UnknownError $e) {
            if (strpos($e->getMessage(), self::ERROR_WEBDRIVER_HEADLESS) !== 0) {
                throw new DriverException('Failed to maximise window', $e);
            }

            // We caught an exception that indicates we're running in headless mode, and therefore cannot maximize.
            // We'll set our window size the the default width and height instead.
            $this->resizeWindow(env('WEBDRIVER_WIDTH'), env('WEBDRIVER_HEIGHT'));
        } catch (UnsupportedDriverActionException $e) {
            self::$warnings[self::WARN_CANNOT_RESIZE] = true;
        }
    }

    /**
     * Asserts that a field with a specified exists on the page.
     *
     * @Then there should be a field with the value of :value
     *
     * @throws Exception If the timeout expires and the lambda has thrown a Exception.
     */
    public function assertFieldExistsValue($value)
    {
        $this->waitFor(function () use ($value) {
            /** @var NodeElement[] $fields */
            $fields = $this->getSession()->getPage()->findAll('xpath', '//input');

            foreach ($fields as $field) {
                if ($field->getValue() == $value) {
                    return true;
                }
            }

            throw new ExpectationException(
                "An input with the value of $value was not found on the page.",
                $this->getSession()
            );
        });
    }

    /**
     * Waits the seconds specified.
     *
     * @param int $seconds The seconds to wait.
     *
     * @When I wait :seconds seconds
     */
    public function waitSeconds($seconds)
    {
        sleep($seconds);
    }

    /**
     * Asserts that the page has been loaded.
     *
     * @AfterStep
     *
     * @param AfterStepScope $scope
     * @throws
     */
    public function ensurePageIsLoaded(AfterStepScope $scope)
    {
        $this->waitForJqueryLoad();
        $this->waitForPageLoad();
    }

    /**
     * Waits for the page to be loaded.
     *
     * This does not wait for any particular javascript frameworks to be ready, it only waits for the DOM to be
     * ready. This is done by waiting for the document.readyState to be "complete".
     *
     * @Given the page has finished loading
     * @Then  the page should finish loading
     *
     * @param  int       $timeout the number of seconds to wait for before giving up.
     * @throws Exception If the timeout expires and the lambda has thrown a Exception.
     */
    public function waitForPageLoad($timeout = 120)
    {
        /* @noinspection PhpUnhandledExceptionInspection waitFor only bubbles the closures' exception */
        ContextHelper::waitFor(function () {
            $readyState = $this->getSession()->evaluateScript('document.readyState');
            if ($readyState !== 'complete') {
                throw new ExpectationException("Page is not loaded. Ready state is '$readyState'", $this->getSession());
            }
        }, $timeout);
    }

    /**
     * Waits for jQuery AJAX requests to complete.
     *
     * @throws ExpectationException if the page hangs and never stops loading.
     */
    public function waitForJqueryLoad()
    {
        $start = time();
        do {
            $requestsWaiting = $this->getSession()->evaluateScript(<<<'JS'
return $.active;
JS
            );
        } while ($requestsWaiting && time() - $start < 30);

        if ($requestsWaiting) {
            throw new ExpectationException('Page was still loading after 30 seconds.', $this->getSession());
        }
    }

    /**
     * Captures a screenshot and saves it to the artifacts directory.
     *
     * @When  /^(?:I )?take a screenshot(?: named "(?P<name>(?:[^"]|\\")*)")?$/
     *
     * @param string $name the name for the screenshot file (excluding path and extension)
     */
    public function takeScreenShot($name = 'screenshot')
    {
        $file = file_exists($this->artifacts->getPath($name) . '.png')
            ? $this->artifacts->getPath($name . '-' . uniqid('', true)) . '.png'
            : $this->artifacts->getPath($name) . '.png';

        file_put_contents($file, $this->getSession()->getDriver()->getScreenshot());
    }

    /**
     * Captures screenshots of failed scenarios.
     *
     * @AfterStep
     * @param AfterStepScope $scope
     */
    public function takeScreenShotAfterFailedStep(AfterStepScope $scope)
    {
        if (TestResult::FAILED === $scope->getTestResult()->getResultCode()) {
            $driver = $this->getSession()->getDriver();
            if (!($driver instanceof Selenium2Driver)) {
                return;
            }

            $this->resizeWindow($this->browser_width, 10000);

            $this->takeScreenShot($this->artifacts->getStepPath($scope));
        }
    }

    /**
     * Saves the source of the current page for failed scenarios.
     *
     * @AfterStep
     * @param AfterStepScope $scope
     */
    public function savePageSourceAfterFailedStep(AfterStepScope $scope)
    {
        if (TestResult::FAILED !== $scope->getTestResult()->getResultCode()) {
            return;
        }

        $fileName = $this->artifacts->getStepPath($scope) . '.source.txt';

        file_put_contents(
            $this->artifacts->getPath($fileName),
            $this->getSession()->getPage()->getContent()
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getArtifactsDir()
    {
        return ContextHelper::getArtifactsDir();
    }

    /**
     * Resize window to dimensions given.
     *
     * @Given the window size is :width by :height pixels
     * @param int $width  This will be the width for the resize
     * @param int $height This will be the height for the resize
     */
    public function resizeWindow($width, $height)
    {
        try {
            $this->getSession()->getDriver()->resizeWindow((int) $width, (int) $height);

            $this->browser_width = $width;
        } catch (UnsupportedDriverActionException $e) {
            self::$warnings[self::WARN_CANNOT_RESIZE] = true;
        }
    }

    /**
     * @When I set my geolocation to ":x,:y"
     *
     * @param $x
     * @param $y
     *
     * @throws UnsupportedDriverActionException
     * @throws DriverException
     */
    public function setGeoLocation($x, $y)
    {
        $this->getSession()->getDriver()->executeScript('window.navigator.geolocation.getCurrentPosition=' .
            "function(success){var position = {\"coords\" : {\"latitude\": $x,\"longitude\": $y}};" .
            'success(position);}');
    }
}
