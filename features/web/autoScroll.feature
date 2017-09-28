Feature: Auto scroll to lab in the list when map marker is clicked
  In order to find the information for my current clicked lab easily
  As a customer
  I should be able to see the lab result auto scroll to the one I selected in the map

  Scenario: Lab result auto scroll to the current selected one on map
    When I am on "/auto-scroll.php"
     And I fill in "Enter your zip" with "77057"
     And I press "Search"
    Then I should see "Choose This Location"
     And I should see "4 Results"
    When I click on the "Lab D" marker
     And I wait 1 seconds
    Then "Lab D" should be in the viewport of search result
     And "Lab A" should not be in the viewport of search result
    When I click on the "Lab A" marker
     And I wait 1 seconds
    Then "Lab A" should be in the viewport of search result
     And "Lab D" should not be in the viewport of search result
