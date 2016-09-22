Feature: Find Collection Centers
  In order to visit a collection center
  As a customer
  I have to be able to search for collection centers

  Scenario: Find a select collection center
    When I am on "/simple.php"
     And I fill in "Enter your zip" with "77057"
     And I press "Search"
    Then I should see "23816 Hwy 59 North"

  Scenario: Lab Result Button Removed
   Given I am on "/has-button-false.php"
     And I fill in "Enter your zip" with "77057"
     And I press "Search"
    Then I should see "23816 Hwy 59 North"
     And I should not see "Choose Location"
