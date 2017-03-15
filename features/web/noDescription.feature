Feature: No Search Description
  In order to hide the search description and save screen real estate
  As an end user
  I should able to see no search description

  Scenario: Search description hidden successfully
    Given I am on "/no-description.php"
     Then I should see "Find A Lab - No Description"
      But I should not see "Please note that these Test Centers do not accept payment. You must place your order and submit payment over the phone or online before visiting any of the Test Centers."
