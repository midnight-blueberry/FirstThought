Feature: Text align icon
  Scenario: Left variant renders lines with specific widths
    Given text align icon variant is left
    When icon is rendered with color "#FF00FF"
    Then lines have widths 16 20 12 and color "#FF00FF"

  Scenario: Justify variant renders lines with specific widths
    Given text align icon variant is justify
    When icon is rendered with color "#FF00FF"
    Then lines have widths 24 24 24 and color "#FF00FF"
