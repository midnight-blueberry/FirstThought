Feature: Preview note rendering
  Scenario: PreviewNote resolves font and applies align and accent styles
    Given settings font family is "Roboto Slab" for PreviewNote
    Given settings font weight is "500" for PreviewNote
    When PreviewNote is rendered with justify align and accent color "#00FF00"
    Then resolveFont is called with family key "Roboto_Slab" for PreviewNote
    Then resolveFont is called with weight 500 for PreviewNote
    Then rendered preview text style includes justify alignment and resolved font family
    Then preview container style includes border color "#00FF00"
