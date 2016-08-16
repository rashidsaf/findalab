Feature: Find Collection Centers
  In order to visit a collection center
  As a customer
  I have to be able to search for collection centers

  Scenario: Find a select collection center
    When I am on "/simple.php"
     And I fill in "Fill in the zippaty codes" with "77057"
     And I press "Find Simple"
    Then I should see "23816 Hwy 59 North"
