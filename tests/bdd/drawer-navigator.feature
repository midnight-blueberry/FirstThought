Feature: Drawer navigator
  Scenario: Builds drawer options for large screens
    Given screen width is 1000
    Given safe area top inset is 20
    When DrawerNavigator is rendered
    Then drawerScreenOptions is called with drawerWidth 320
    Then useHeaderConfig is called with top inset 20
    Then drawerRoutes is called with baseHeaderStyle returned by useHeaderConfig

  Scenario: Builds drawer options for small screens
    Given screen width is 300
    Given safe area top inset is 0
    When DrawerNavigator is rendered
    Then drawerScreenOptions is called with drawerWidth 240
