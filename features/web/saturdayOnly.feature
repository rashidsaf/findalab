Feature: Labs with Saturday Hours Filter
  In order to find the only labs which have saturday open hour
  As a customer
  I should be filter out the search result using the saturday hours filter

  Scenario: Search result refreshed when change filter
    When I am on "/saturday-only.php"
     And I fill in "Enter your zip" with "77057"
     And I press "Search"
    Then I should see "Choose This Location"
     And I should see "27 Results"
    When I check radio button "Have Saturday Hours"
    Then I should see "5 Results"
    When I check radio button "All"
    Then I should see "27 Results"
