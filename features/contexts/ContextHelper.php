<?php namespace features\contexts;

use ArrayAccess;
use Exception;
use InvalidArgumentException;
use OutOfBoundsException;

/**
 * Various helper functions for contexts.
 */
abstract class ContextHelper
{
    /**
     * Calls the $lambda until it returns successful or the timeout expires.
     * This method is a "spinner" that will check a condition as many times as possible during the specified timeout
     * period. As soon as the lambda returns true, the method will return. This is useful when waiting on remote
     * drivers such as Selenium.
     *
     * @param  callable  $lambda  The lambda to call. Must return true on success.
     * @param  int       $timeout The number of seconds to spin for.
     * @throws Exception If the timeout expires and the lambda has thrown a Exception.
     * @return mixed     The result of the lambda if it succeeds.
     */
    public static function waitFor(callable $lambda, $timeout = 30)
    {
        $lastException = new Exception(
            'Timeout expired before a single try could be attempted. Is your timeout too short?'
        );

        $start = time();
        while (time() - $start < $timeout) {
            try {
                return $lambda();
            } catch (Exception $e) {
                $lastException = $e;
            }

            // sleep for 10^8 nanoseconds (0.1 second)
            time_nanosleep(0, pow(10, 8));
        }

        throw $lastException;
    }

    /**
     * Asserts that an item is in an array using "dot" notation.
     *
     * @param  array                    $array    The given array to look for the value.
     * @param  string                   $key      The given key to find in the array.
     * @param  string                   $expected The expected value for the array key.
     * @throws InvalidArgumentException If the passed object is not an array.
     * @throws InvalidArgumentException If the key is not found in the array.
     * @throws InvalidArgumentException If the expected value is not the same in the array.
     */
    public static function assertArrayDotValueMatches($array, $key, $expected)
    {
        if (!is_array($array)) {
            throw new InvalidArgumentException("$array must be an array");
        }

        foreach (explode('.', $key) as $segment) {
            if (!isset($array[$segment])) {
                throw new InvalidArgumentException("$key key not found in array");
            }

            $array = $array[$segment];
        }

        if ($array != $expected) {
            throw new InvalidArgumentException("Expected $key to be $expected, got " . $array);
        }
    }

    /**
     * Provides the directory that test artifacts should be stored to.
     *
     * @return string the fully qualified directory, with no trailing directory separator.
     */
    public static function getArtifactsDir()
    {
        return realpath(__DIR__ . '/../../artifacts');
    }

    /**
     * Get an item from an array using "dot" notation.
     *
     * @param ArrayAccess|array $array The array to be searched for with dot notation.
     * @param string            $key   The key(s) to retrieve values from.
     *
     * @throws InvalidArgumentException When Key is null
     * @throws OutOfBoundsException     When Key does not exist.
     * @return mixed
     */
    public static function array_get_value($array, $key)
    {
        if (is_null($key)) {
            throw new InvalidArgumentException('Key must not be null');
        }

        if (isset($array[$key])) {
            return $array[$key];
        }

        foreach (explode('.', $key) as $segment) {
            if (!is_array($array) || !isset($array[$segment])) {
                throw new OutOfBoundsException('Key '. $key .' does not Exists');
            }

            $array = $array[$segment];
        }

        return $array;
    }
}
