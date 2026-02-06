Feature: AppText
  Scenario: AppText uses settings font and theme styles
    Given settings font family is "Roboto Slab"
    Given settings font weight is "500"
    When AppText is rendered
    Then resolveFont is called with family key "Roboto_Slab"
    Then resolveFont is called with weight 500
    Then rendered Text style has fontFamily "font:Roboto_Slab:500"
    Then rendered Text style has color "#111111"
    Then rendered Text style has fontSize 18

  Scenario: AppText props override settings
    Given settings font family is "Roboto Slab"
    Given settings font weight is "500"
    Given AppText prop font family is "Nata Sans"
    Given AppText prop font weight is "700"
    When AppText is rendered
    Then resolveFont is called with family key "Nata_Sans"
    Then resolveFont is called with weight 700
    Then rendered Text style has fontFamily "font:Nata_Sans:700"
