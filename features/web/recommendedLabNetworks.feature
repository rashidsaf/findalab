Feature: Recommended Lab Networks
  In order to get the best customer experience
  As a customer
  I should be shown which labs are recommended by the company

  Scenario: Search result refreshed when change filter
    When I am on "/recommended.php"
     And I fill in "Enter your zip" with "77057"
     And I press "Search"
     And I should see "Recommended"
