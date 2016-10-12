Feature: Findalab Reset
  In order to create a clean slate on the labfinder
  As a developer
  I need to be able to reset the labfinder

  Scenario: Findalab resets properly when reset function is called
    Given I am on "/simple.php"
     When I fill in "Enter your zip" with "77057"
      And I press "Search"
     Then I should see "Choose This Location"
     When I press "Reset findalab"
     Then I should not see "Choose This Location"
      And I should see "Please \"Enter your zip\""
      And I should see "No Results"
