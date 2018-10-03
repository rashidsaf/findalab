Feature: Hidden, Preloaded Map
  In order to quickly peruse labs near my current choice
  As a customer
  I should see a map of nearby labs if I open a labfinder that has already been searched in

  Scenario: Map is zoomed properly when manually opened after a search
    When I am on "/hidden-preloaded.php"
    Then I should see "Map Ready"
    When I press "Show Map"
    Then I should see "25 Results"
     And the findalab map should be zoomed to at least level 8
