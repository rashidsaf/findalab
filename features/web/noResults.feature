Feature: No Results Message
  In order to know that the lab finder isn't broken, I just live out in podunk town
  As an end user
  I need to see a message explaining that there are no labs nearby

  Scenario: User is alerted when there are no results
    Given I am on "/no-results.php"
     When I fill in "Zip code" with "77054"
      And I press "Find"
     Then I should see "Sorry, we could not find any testing centers near that location"
