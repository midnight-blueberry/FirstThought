Feature: Drawer linking configuration
  Scenario: Validates drawer linking prefixes and screen paths
    Given the drawer linking configuration
    When I inspect its prefixes and screens
    Then the prefixes include the firstthought scheme
    Then the home and settings screen paths are configured correctly
