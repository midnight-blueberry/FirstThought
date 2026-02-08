Feature: Setting row container
  Scenario: Static setting row renders a View with margin
    Given SettingRow is rendered without onPress
    Then Root container is a View with small margin bottom

  Scenario: Pressable setting row announces button role
    Given SettingRow is rendered with onPress
    Then Root container is a Pressable with button role

  Scenario: Disabled pressable setting row exposes disabled state
    Given SettingRow is rendered with onPress and disabled
    Then Root container is a disabled Pressable with accessibility state
