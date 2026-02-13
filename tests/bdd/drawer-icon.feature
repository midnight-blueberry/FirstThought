Feature: Drawer icon
  Scenario: Route icon mapping returns Home icon and forwards size and color
    Given drawer icon size is 24
    Given drawer icon color is "#FF0000"
    Given drawer route name is "Home"
    Given drawer icon focused is true
    When DrawerIcon is rendered
    Then icon name should be "home"
    Then icon size should be 24
    Then icon color should be "#FF0000"

  Scenario: Route icon mapping returns Settings icon and forwards size and color
    Given drawer icon size is 20
    Given drawer icon color is "#00FF00"
    Given drawer route name is "Settings"
    Given drawer icon focused is false
    When DrawerIcon is rendered
    Then icon name should be "settings"
    Then icon size should be 20
    Then icon color should be "#00FF00"
