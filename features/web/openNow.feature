Feature: Currently Open Lab
  In order to know that a lab is currently open
  As an end user
  I need to see a open now text and allow users to see the hours.

  Scenario: a Lab is currently Open
    Given I am on "/24-hour-lab.php"
     When I fill in "Enter your zip" with "77054"
      And I press "Search"
     Then I should see the following lab in the results:
       | 201 KINGWOOD MEDICAL DR #A100 |
       | KINGWOOD, TX 77339            |
      And I should see "Open Now Open 24 hours"
     When I follow "Show ▼"
     Then there should be a table on the page with the following information:
       | Monday    | Open 24 hours     |
       | Tuesday   | 8:00 AM - 5:30 PM |
       | Wednesday | 8:00 AM - 5:30 PM |
       | Thursday  | 8:00 AM - 5:30 PM |
       | Friday    | 8:00 AM - 5:30 PM |

  Scenario: a Lab is currently closed
    Given I am on "/closed-lab.php"
     When I fill in "Enter your zip" with "77054"
      And I press "Search"
     Then I should see the following lab in the results:
       | 1213 Hermann Drive Suite 120 |
       | Houston, TX 77004            |
     And I should not see "Open Now"
     When I follow "Show ▼"
     Then there should be a table on the page with the following information:
       | Monday    | 0:00 AM - 0:01 AM |
       | Tuesday   | 0:00 AM - 0:01 AM |
       | Wednesday | 0:00 AM - 0:01 AM |
       | Thursday  | 0:00 AM - 0:01 AM |
       | Friday    | 0:00 AM - 0:01 AM |
       | Saturday  | 0:00 AM - 0:01 AM |
       | Sunday    | 0:00 AM - 0:01 AM |
