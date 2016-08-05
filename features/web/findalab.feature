Feature: Find Collection Centers
  In order to visit a collection center
  As a customer
  I have to be able to search for collection centers

  Scenario: Find a select collection center
    When I am on "/"
#     And I fill "Fill in the zippaty codes" with "77057"
     And I press "Find Simple"
     And I should see "23816 Hwy 59 North"
     And I press "Choose this place, yo!"
    Then I should see ""
