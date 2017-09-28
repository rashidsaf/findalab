Feature: Google Maps API
  In order to view the location of collection centers
  As a customer
  I have to be able to interact with a Google Map

  Scenario: Generate Google Map Pins for Lab Results
   Given I am on "/labs-results.php"
     And I fill in "Enter your zip" with "77057"
     And I press "Search"
    Then I should see "LabCorp"
     And I should not see "In-Home Collection"
     And there should be 25 pins on the map
     And I should see "25 Results"
