<?php

namespace features\contexts;

use Behat\Behat\Context\Context;
use Behat\Behat\Hook\Scope\AfterScenarioScope;
use Behat\Behat\Hook\Scope\AfterStepScope;
use Symfony\Component\Filesystem\Exception\FileNotFoundException;

/**
 * A helper class for managing artifact files.
 *
 * @throws FileNotFoundException
 */
class ArtifactContext implements Context
{
    /** @var string The directory where artifacts are stored */
    protected $dir;

    /**
     * ArtifactContext constructor.
     *
     * @throws FileNotFoundException
     */
    public function __construct()
    {
        if (!$dir = realpath(__DIR__ . '/../../artifacts')) {
            throw new FileNotFoundException("Could not find artifacts directory: $dir");
        }

        $this->dir = $dir;
    }

    /**
     * Provides the filename (excluding extension) that artifacts for this step should be saved under.
     *
     * @param AfterStepScope $scope the scope for the step
     *
     * @return string the file name (excluding extension)
     */
    public function getStepPath(AfterStepScope $scope)
    {
        $fileName = $scope->getFeature()->getTitle() . '-' . $scope->getStep()->getText();

        return $this->cleanFilename($fileName);
    }

    /**
     * Provides the filename (excluding extension) that artifacts for this step should be saved under.
     *
     * @param AfterScenarioScope $scope the scope for the step
     *
     * @return string the file name (excluding extension)
     */
    public function getScenarioPath(AfterScenarioScope $scope)
    {
        $fileName = $scope->getFeature()->getTitle() . '-' . $scope->getScenario()->getTitle();

        return $this->cleanFilename($fileName);
    }

    /**
     * Gets the path to an artifact file.
     *
     * @param string $filename the name of the file in the artifact directory
     *
     * @return string the full file path, or the artifact directory if no filename was given
     */
    public function getPath($filename = '')
    {
        return realpath(__DIR__ . '/../../artifacts') . DIRECTORY_SEPARATOR . $filename;
    }

    /**
     * Removes anything which isn't a word, whitespace, number or any of the following characters -_~,;[](), replaces
     * white spaces with underscore and avoid the 255 character limit.
     *
     * @param string $fileName File name to clean
     *
     * @return string the file name (excluding extension)
     */
    private function cleanFilename($fileName)
    {
        // clean the filename (see http://stackoverflow.com/a/2021729)

        // Remove anything which isn't a word, whitespace, number
        // or any of the following characters -_~,;[]().
        $fileName = mb_ereg_replace('([^\w\s\d\-_~,;\[\]\(\).])', '', $fileName);

        // Remove any runs of periods
        $fileName = mb_ereg_replace('([\.]{2,})', '', $fileName);

        // Replace whitespace with underscores
        $fileName = mb_ereg_replace('(\s+)', '_', $fileName);

        // Avoid 255-character filename limit
        $fileName = substr($fileName, 0, 100);

        return $fileName;
    }
}
