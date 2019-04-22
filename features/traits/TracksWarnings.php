<?php namespace features\traits;

trait TracksWarnings
{
    /** @var array */
    protected static $warnings = [];

    /**
     * @AfterSuite
     */
    public static function showWarnings()
    {
        echo '[Behat] Generating Suite warning report' . PHP_EOL;
        $count = count(self::$warnings);
        if ($count) {
            echo "$count Warnings:\n";
            foreach (self::$warnings as $message => $flag) {
                echo $message . "\n";
            }
        }
        echo '[Behat] Warning reporting complete' . PHP_EOL;
    }
}
