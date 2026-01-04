Feature: Drawer linking
  Scenario: Exposes correct prefixes and screen paths
    Given drawer linking configuration is available
    When I read the drawer linking data
    Then the prefixes include "firstthought://"
    Then the Home screen path is empty
    Then the Settings screen path is "settings"
