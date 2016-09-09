Feature: Findalab Reset
  In order to create a clean slate on the labfinder
  As a developer
  I need to be able to reset the labfinder

  Scenario: Findalab resets properly when reset function is called
    Given I am on "/simple.php"
     When I fill in "Fill in the zippaty codes" with "77057"
      And I press "Find Simple"
     Then I should see "Choose this place"
     When I press "Reset findalab"
     Then I should not see "Choose this place"
      And I should see "Please \"Fill in the zippaty codes\""
      And I should see "No Results"
