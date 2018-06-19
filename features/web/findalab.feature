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
     And I should not see "Choose This Location"

  Scenario: On search zip code field is populated
    Given I am on "/populate-zip.php"
     When I set the cookie "postalCode" with value "77054"
     When I reload the page
     Then there should be a field with the value of 77054
      And I should see "23816 Hwy 59 North"
      And I should not see "Choose This Location"

  Scenario: Use Current Location
    Given I am on "https://findalab.local/user-location.php"
     When I wait 4 seconds
      And I press "Locate me"
     Then I should see "23816 Hwy 59 North"

  Scenario: View Lab information
    Given I am on "simple.php"
      And I fill in "Enter your zip" with "77057"
      And I press "Search"
     Then I should see the following lab in the results:
        | 23816 Hwy 59 North |
        | Kingwood, TX 77339 |

  Scenario: View Lab information with 2nd address line
    Given I am on "view-details.php"
      And I fill in "Enter your zip" with "77057"
      And I press "Search"
     Then I should see the following lab in the results:
        | 23816 Hwy 59 North |
        | Suite 200          |
        | Kingwood, TX 77339 |

  Scenario: View Lab information with 2nd address line
    Given I am on "view-details-new.php"
      And I fill in "Enter your zip" with "77057"
      And I press "Search"
     Then I should see the following lab in the results:
        | 23816 Hwy 59 North |
        | Suite 200          |
        | Kingwood, TX 77339 |

  Scenario: The Select a Lab Button Should Render Specified Lab Data
     When I am on "/simple.php"
      And I fill in "Enter your zip" with "77057"
      And I press "Search"
     Then I should see "23816 Hwy 59 North"
      And the following lab data should be available for the lab selected:
        | data-id         |
        | data-address    |
        | data-address_2  |
        | data-city       |
        | data-state      |
        | data-zip_code   |
        | data-network    |
        | data-title      |
        | data-country    |
        | data-fax_number |
        | data-network_id |
