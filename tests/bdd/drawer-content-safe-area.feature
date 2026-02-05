Feature: Drawer content safe area
  Scenario: Applies safe area padding and forwards drawer props
    Given safe area inset top is 12
    Given safe area inset bottom is 34
    When DrawerContent is rendered
    Then DrawerContentScrollView has paddingTop 12
    Then DrawerContentScrollView has paddingBottom 34
    Then DrawerItemList receives testProp "hello"

  Scenario: Applies zero safe area padding when no insets
    Given safe area inset top is 0
    Given safe area inset bottom is 0
    When DrawerContent is rendered
    Then DrawerContentScrollView has paddingTop 0
    Then DrawerContentScrollView has paddingBottom 0
