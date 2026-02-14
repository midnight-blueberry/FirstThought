Feature: Drawer icon
  Scenario: Renders callback icon for home
    Given material icon name is "home"
    Given drawer icon size is 24
    Given drawer icon color is "#FF0000"
    When DrawerIcon callback is rendered
    Then MaterialIcons name should be "home"
    Then MaterialIcons size should be 24
    Then MaterialIcons color should be "#FF0000"

  Scenario: Renders callback icon for settings
    Given material icon name is "settings"
    Given drawer icon size is 20
    Given drawer icon color is "#00FF00"
    When DrawerIcon callback is rendered
    Then MaterialIcons name should be "settings"
    Then MaterialIcons size should be 20
    Then MaterialIcons color should be "#00FF00"
