Feature: Labs with Saturday Hours Filter
  In order to find the only labs which have saturday open hour
  As a customer
  I should be filter out the search result using the saturday hours filter

  Scenario: Search result refreshed when change filter
    When I am on "/saturday-only.php"
     And I fill in "Enter your zip" with "77057"
     And I press "Search"
    Then I should see "Choose This Location"
     And I should see "25 Results"
     And I set the lab hours to "Open Saturdays"
    Then I should see "4 Results"
    When I set the lab hours to "All"
    Then I should see "25 Results"
