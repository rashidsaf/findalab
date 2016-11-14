Feature: Findalab Loads Nicely
  In order to choose a collection center
  As a customer
  I should be presented with a user interface that is intuitive

  Scenario: Loading state appears before component starts to load
    When I am on "/loading.php"
    Then I should see "Loading Test Centers"

  Scenario: Loading state is removed and component appears
   Given I am on "/loading.php"
    When I wait 4 seconds
    Then I should see "Test Centers"
     And I should see "Please \"Enter your zip\" above and press \"Search\" to see results."
     And I should not see "Loading Test Centers"
