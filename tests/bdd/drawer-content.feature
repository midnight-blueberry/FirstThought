Feature: Drawer content
  Scenario: Passes props and insets to drawer components
    Given safe area insets are mocked
    Given drawer navigation props are prepared
    When I render DrawerContent
    Then DrawerContentScrollView uses safe area paddings
    Then DrawerContentScrollView receives navigation props
    Then DrawerItemList receives navigation props
