Feature: Only States Filter
  In order to get the best customer experience
  As a customer
  I should be shown with labs in specific states

  Scenario: Search result shows labs in only filtered states of TX and IL
    When I am on "/only-states.php"
     And I fill in "Enter your zip" with "77057"
     And I press "Search"
    Then I should see "Choose This Location"
     And I should see "3 Results"
     And I should see the following:
       | Lab in TX #1 |
       | Lab in TX #2 |
       | Lab in IL #1 |
     And I should not see "Lab in CA #1"
     And I should not see "Lab in FL #1"
