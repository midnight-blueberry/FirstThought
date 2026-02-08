Feature: AppTextInput
  Scenario: AppTextInput uses settings font
    Given settings font family is "Roboto Slab"
    Given settings font weight is "500"
    When AppTextInput is rendered
    Then resolveFont is called with family key "Roboto_Slab"
    Then resolveFont is called with weight 500
    Then rendered TextInput style has fontFamily "font:Roboto_Slab:500"

  Scenario: AppTextInput merges style prop
    Given settings font family is "Roboto Slab"
    Given settings font weight is "500"
    Given AppTextInput style has fontSize 22
    When AppTextInput is rendered
    Then rendered TextInput style has fontFamily "font:Roboto_Slab:500"
    Then rendered TextInput style has fontSize 22
