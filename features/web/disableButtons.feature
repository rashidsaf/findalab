Feature: Findalab Input Fields Disable When Button Is Clicked
  In order to choose a better lab or slower lab
  As a customer
  I should not be able to click more buttons after I have clicked keep current lab

  Scenario: Disabled state appears after keep current lab button is clicked and is removed after specified time
    When I am on "/disable-buttons.php"
     And I fill in "Enter your zip" with "77057"
     And I press "Search"
    When I press "Keep Current Lab"
    Then the "Choose This Location" button should be disabled
     And the "Search" button should be disabled
    When I wait 5 seconds
    Then the "Choose This Location" button should be enabled
     And the "Search" button should be enabled

   Scenario: Disabled state appears after choose this location button is clicked and is removed after specified time
     When I am on "/disable-buttons.php"
      And I fill in "Enter your zip" with "77057"
      And I press "Search"
     When I press "Choose This Location"
     Then the "Choose This Location" button should be disabled
      And the "Search" button should be disabled
     When I wait 5 seconds
     Then the "Choose This Location" button should be enabled
      And the "Search" button should be enabled
